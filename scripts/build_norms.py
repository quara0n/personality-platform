"""Build aggregate Johnson120 reference tables; never export participant rows.
Requires numpy and xlrd. Pass --repo and --output; no app files are modified.
"""
import argparse
import csv
import hashlib
import io
import json
import math
import sys
import zipfile
from pathlib import Path

import numpy as np
import xlrd


def digest(data):
    return hashlib.sha256(data).hexdigest()


def normalized(text):
    return text.strip().rstrip('.').casefold().replace('’', "'")


def save(path, value):
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def run(repo, out):
    out.mkdir(parents=True, exist_ok=True)
    source = repo / 'artifacts/norm-research/IPIP120.dat'
    source_hash = digest(source.read_bytes())
    assert source_hash == '526daf7ebe7d480ba71258cd20f0fc3b37ab3a43a2e4191c19a49e185a1df53b'
    archive_path = repo / 'artifacts/norm-research/source.zip'
    with zipfile.ZipFile(archive_path) as archive:
        key_zip = next(n for n in archive.namelist() if n.startswith('Scoring Key'))
        with zipfile.ZipFile(io.BytesIO(archive.read(key_zip))) as nested:
            key_bytes = nested.read('IPIP-NEO-ItemKey.xls')
    sheet = xlrd.open_workbook(file_contents=key_bytes).sheet_by_index(0)
    key = {}
    for i in range(1, sheet.nrows):
        full, short, sign, code, name, text = sheet.row_values(i)
        if isinstance(short, (int, float)) and short > 0:
            key[int(short)] = dict(code=code, sign=sign[0], name=name, text=text)
    assert sorted(key) == list(range(1, 121))
    questions_path = repo / 'app/data/questions.json'
    questions = json.loads(questions_path.read_text(encoding='utf-8-sig'))
    norwegian = json.loads((repo / 'app/data/questions-no.json').read_text(encoding='utf-8-sig'))
    assert len(questions) == len(norwegian) == 120
    mapping = []
    for pos, (question, no) in enumerate(zip(questions, norwegian), 1):
        k = key[pos]
        if pos == 58:
            assert normalized(k['text']) == 'believe that there is no absolute right or wrong'
            assert normalized(question['text']) == 'believe that there is no absolute right and wrong'
        else:
            assert normalized(question['text']) == normalized(k['text']), pos
        assert question['domain'] + str(question['facet']) == k['code'], pos
        assert question['keyed'] == ('plus' if k['sign'] == '+' else 'minus'), pos
        assert all(question[v] == no[v] for v in ('id', 'domain', 'facet', 'keyed'))
        mapping.append(dict(archiveItem=pos, questionId=question['id'], code=k['code'],
                            keyed=question['keyed'], text=question['text'], archiveText=k['text']))
    facets = [d + str(f) for d in 'NEOAC' for f in range(1, 7)]
    codes = list('NEOAC') + facets
    indices = {code: [pos - 1 for pos, k in key.items()
                      if k['code'] == code or (len(code) == 1 and k['code'][0] == code)]
               for code in codes}
    assert all(len(indices[c]) == (24 if len(c) == 1 else 4) for c in codes)
    payload = bytearray()
    ages = bytearray()
    total_rows = 0
    with source.open('rb') as data:
        for line in data:
            row = line.rstrip(b'\r\n')
            total_rows += 1
            assert len(row) == 151
            if row[22:31].strip() == b'USA':
                payload.extend(row[31:151])
                ages.append(int(row[7:9]))
    x = np.frombuffer(payload, dtype=np.uint8).reshape(-1, 120) - 48
    age = np.frombuffer(ages, dtype=np.uint8)
    assert x.shape == (447500, 120) and x.max() <= 5 and total_rows == 619150
    complete = (x > 0).all(axis=1)
    primary = complete & (age >= 18) & (age <= 90)
    n = int(primary.sum())
    assert n == 243307 and int(complete.sum()) == 296766
    selected = x[primary]
    sums = {code: selected[:, ix].sum(axis=1) for code, ix in indices.items()}
    tables = {}
    checks = []
    for code in codes:
        lo, hi = (24, 120) if len(code) == 1 else (4, 20)
        counts = np.bincount(sums[code].astype(int), minlength=hi+1)[lo:hi+1]
        below = np.cumsum(counts) - counts
        ranks = 100 * (below + counts / 2) / n
        assert int(counts.sum()) == n and np.all(np.diff(ranks) >= 0)
        assert np.all((ranks >= 0) & (ranks <= 100))
        ordered = np.sort(sums[code])
        points = []
        for score, count, lower, rank in zip(range(lo, hi+1), counts, below, ranks):
            # Independent search-based check of every lookup entry.
            left = int(np.searchsorted(ordered, score, side='left'))
            right = int(np.searchsorted(ordered, score, side='right'))
            assert left == int(lower) and right-left == int(count)
            assert abs(rank - 100 * (left + (right-left)/2) / n) < 1e-10
            points.append(dict(sum=score, count=int(count), below=int(lower),
                               percentile=round(float(rank), 6),
                               displayPercentile=int(math.floor(float(rank)+0.5))))
        tables[code] = dict(itemCount=len(indices[code]), minSum=lo, maxSum=hi, n=n,
                            meanSum=round(float(sums[code].mean()), 6),
                            sdSum=round(float(sums[code].std(ddof=1)), 6), lookup=points)
        checks.append(dict(code=code, checkedPoints=len(points), countTotal=n,
                           monotonic=True, independentSearchMatches=True))
    # Sensitivities are diagnostics, not silently substituted norms.
    negatives = np.array([key[i]['sign'] == '-' for i in range(1, 121)])
    raw_selected = np.where(negatives, 6-selected, selected)
    constant = (raw_selected == raw_selected[:, :1]).all(axis=1)
    missing = (x == 0).sum(axis=1)
    eligible_partial = ((age >= 18) & (age <= 90) & (missing <= 4))
    for code in facets:
        eligible_partial &= (x[:, indices[code]] > 0).sum(axis=1) >= 3
    scenarios = {
        'complete_age_19_69': {c: x[complete & (age >= 19) & (age <= 69)][:, ix].sum(axis=1)
                             for c, ix in indices.items()},
        'complete_age_18_34': {c: selected[age[primary] < 35][:, ix].sum(axis=1) for c, ix in indices.items()},
        'complete_age_35_90': {c: selected[age[primary] >= 35][:, ix].sum(axis=1) for c, ix in indices.items()},
        'complete_all_recorded_ages_10_99': {c: x[complete][:, ix].sum(axis=1) for c, ix in indices.items()},
        'exclude_constant_raw_response_profiles': {c: sums[c][~constant] for c in codes},
    }
    partial = x[eligible_partial]
    prorated = {c: partial[:, indices[c]].sum(axis=1) * 4.0 /
                  (partial[:, indices[c]] > 0).sum(axis=1) for c in facets}
    prorated.update({d: sum(prorated[d+str(f)] for f in range(1,7)) for d in 'NEOAC'})
    scenarios['up_to_four_missing_items_prorated_with_at_least_three_per_facet'] = prorated
    sensitivity = {}
    for scenario, values in scenarios.items():
        changes = {}
        for c in codes:
            ordered = np.sort(values[c])
            grid = np.array([p['sum'] for p in tables[c]['lookup']])
            # Small epsilon handles floating-point sums of prorated facets.
            left = np.searchsorted(ordered, grid-1e-8, side='left')
            right = np.searchsorted(ordered, grid+1e-8, side='right')
            ranks = 100*(left+(right-left)/2)/len(ordered)
            original = np.array([p['percentile'] for p in tables[c]['lookup']])
            diff = ranks-original
            at = int(np.abs(diff).argmax())
            changes[c] = dict(maxAbsolutePercentilePointChange=round(float(abs(diff[at])), 4),
                              atSum=int(grid[at]), signedChangeAtSum=round(float(diff[at]),4))
        sensitivity[scenario] = dict(n=len(values['N']), byScale=changes,
                                     maxAcrossAllScales=max(v['maxAbsolutePercentilePointChange'] for v in changes.values()))
    version = 'ipip-neo-120-us-online-adults18-90-complete-midrank-2026-10-11-v1'
    norm = dict(schemaVersion=1, normVersion=version, instrumentVersion='ipip-neo-120-johnson-2014-v1',
                reference=dict(n=n, countryField='USA', ageMin=18, ageMax=90,
                               collectedYears=[2001,2011], testLanguage='English',
                               sampleType='Historical self-selected online response records; not population-representative',
                               filters=['Exact trimmed COUNTRY == USA','Recorded AGE between 18 and 90 inclusive',
                                        'All 120 already-keyed responses in 1..5'],
                               weighting='None', ageOrSexAdjustment='None',
                               additionalQualityScreening='None beyond original archive screening',
                               uniqueness='N counts response records, not guaranteed unique individuals'),
                source=dict(doi='10.23668/psycharchives.2448', url='https://doi.org/10.23668/psycharchives.2448',
                            license='CC-BY-4.0', licenseUrl='https://creativecommons.org/licenses/by/4.0/',
                            attribution='Derived from Kajonius, P. J. & Johnson, J. A. (2019), Supplementary materials, PsychArchives. Filters and percentile calculations by Cinko; no endorsement implied.',
                            filename='IPIP120.dat', sha256=source_hash,
                            archiveMd5=hashlib.md5(archive_path.read_bytes()).hexdigest(),
                            scoringKeySha256=digest(key_bytes), appQuestionsSha256=digest(questions_path.read_bytes())),
                scoring=dict(archiveValuesAlreadyReversed=True,
                             liveAnswers='Reverse only minus-keyed raw responses once: 6-answer. Then sum.',
                             input='Integer keyed sum: 24..120 per domain, 4..20 per facet. Never use the old 0..100 position.',
                             formula='100 * (below + 0.5 * count) / n',
                             ties='Midrank; half of the tied records contribute to rank.',
                             rounding='Display nearest integer with floor(percentile+0.5); retain unrounded counts for calculation.',
                             endpoints='Valid empirical midranks can round to 0 or 100. Do not clamp without explicitly documenting a display-only rule.'),
                applicability=dict(languages=['en','nb'], sameReferenceForBoth=True,
                                   minimumUserAge=18, maximumUserAge=90,
                                   norwegianTransferValidated=False,
                                   noteNo='Sammenlignet med amerikanske nettdeltakere. Sammenligningen bygger på den engelske testen; overføring til norsk språk er ikke særskilt validert.',
                                   noteEn='Compared with US online respondents who took the English test. This historical volunteer sample is not representative of the entire US population.'),
                scales=tables)
    save(out/'ipip-neo-120-us-percentiles-v1.json', norm)
    save(out/'item-mapping.json', mapping)
    save(out/'validation-and-sensitivity.json', dict(sourceSha256=source_hash, n=n,
          itemKeyMatchesArchiveAndFem=120, scaleChecks=checks,
          wordingDifference={'item':58,'facet':'O6','archive':'Believe that there is no absolute right or wrong.',
                             'Fem':'Believe that there is no absolute right and wrong',
                             'effect':'Same position, facet and positive key; wording differs. No app wording changed.'},
          constantRawProfilesInPrimary=int(constant.sum()), sensitivity=sensitivity,
          interpretation='Sensitivity differences are in percentile points, not measurement error or confidence intervals. Age subgroup differences reflect sample composition.'))
    fixtures = []
    for name, raw in [('neutral_all_3',np.full(120,3)),
                      ('all_keyed_minimum',np.where(negatives,5,1)),
                      ('all_keyed_maximum',np.where(negatives,1,5)),
                      ('alternating_raw_1_to_5',np.array([(i%5)+1 for i in range(120)]))]:
        keyed = np.where(negatives,6-raw,raw)
        expected = {}
        for c in codes:
            score = int(keyed[indices[c]].sum())
            expected[c] = next(p for p in tables[c]['lookup'] if p['sum']==score)
        fixtures.append(dict(name=name, synthetic=True, rawAnswersInArchiveOrder=raw.tolist(), expected=expected))
    save(out/'synthetic-verification-cases.json', fixtures)
    with (out/'percentiles.csv').open('w',newline='',encoding='utf-8') as f:
        writer=csv.writer(f)
        writer.writerow(['scale','sum','n','count','below','percentile','displayPercentile'])
        for c in codes:
            for p in tables[c]['lookup']:
                writer.writerow([c,p['sum'],n,p['count'],p['below'],p['percentile'],p['displayPercentile']])
    print(json.dumps(dict(n=n,scales=len(tables),lookupPoints=sum(len(t['lookup']) for t in tables.values()),
                         constantRawProfiles=int(constant.sum()),
                         sensitivities={k:dict(n=v['n'],maxChange=v['maxAcrossAllScales']) for k,v in sensitivity.items()}),indent=2))


if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo',type=Path,required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    run(args.repo,args.output)
