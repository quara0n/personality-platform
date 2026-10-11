"""Build aggregated US reference distributions for Fem's percentiles.

Input: IPIP120.dat from Kajonius & Johnson (2019), PsychArchives
doi:10.23668/psycharchives.2448 (CC BY 4.0). The participant file stays local
(artifacts/norm-research/ is git-ignored); only aggregate counts are written.

Usage:
    python3 scripts/build_norms.py artifacts/norm-research/IPIP120.dat

Record layout (151 characters per row, 1-based columns):
    country 23-31, items I1-I120 in 32-151 (0 = missing).
    The age column is set by --age-cols and defaults to 9-10. Check it against
    DAT120.doc; the script prints counts to compare with the source audit
    (USA, complete, age 18-90: 243 307 rows).

Items in the archive are already reverse-keyed (DAT120.doc), so raw values are
summed directly. Item k in the archive is item k in app/data/questions.json
(Johnson's published order).
"""
import argparse
import collections
import datetime
import hashlib
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
EXPECTED_US_ADULTS = 243_307


def main():
    p = argparse.ArgumentParser()
    p.add_argument('data')
    p.add_argument('--country', default='USA')
    p.add_argument('--min-age', type=int, default=18)
    p.add_argument('--max-age', type=int, default=90)
    p.add_argument('--age-cols', default='9-10', help='1-based inclusive column range of AGE')
    p.add_argument('--out', default=str(ROOT / 'app/data/norms-us.json'))
    a = p.parse_args()

    questions = json.loads((ROOT / 'app/data/questions.json').read_text())
    keys = [(q['domain'], f"{q['domain']}{q['facet']}") for q in questions]
    a0, a1 = (int(x) for x in a.age_cols.split('-'))

    domains = {d: collections.Counter() for d in 'OCEAN'}
    facets = {f'{d}{i}': collections.Counter() for d in 'OCEAN' for i in range(1, 7)}
    seen = complete = kept = 0
    ages = collections.Counter()
    sha = hashlib.sha256()
    with open(a.data, 'rb') as fh:
        for raw in fh:
            sha.update(raw)
            line = raw.decode('ascii', 'replace').rstrip('\r\n')
            if len(line) < 151:
                continue
            seen += 1
            if line[22:31].strip() != a.country:
                continue
            items = line[31:151]
            if any(c not in '12345' for c in items):
                continue
            complete += 1
            try:
                age = int(line[a0 - 1:a1])
            except ValueError:
                continue
            ages[min(age // 10 * 10, 90)] += 1
            if not a.min_age <= age <= a.max_age:
                continue
            kept += 1
            dsum = collections.Counter()
            fsum = collections.Counter()
            for value, (d, f) in zip(items, keys):
                v = int(value)
                dsum[d] += v
                fsum[f] += v
            for d, s in dsum.items():
                domains[d][s] += 1
            for f, s in fsum.items():
                facets[f][s] += 1

    print(f'rows {seen}, {a.country} complete {complete}, kept (age {a.min_age}-{a.max_age}) {kept}')
    print('age decades among complete rows:', dict(sorted(ages.items())))
    if a.country == 'USA' and kept != EXPECTED_US_ADULTS:
        print(f'WARNING: expected {EXPECTED_US_ADULTS} rows from the source audit. Check --age-cols against DAT120.doc.')

    dist = lambda counter, lo, hi: {'min': lo, 'counts': [counter.get(s, 0) for s in range(lo, hi + 1)]}
    out = {
        'normVersion': f'us-online-ipip120-{datetime.date.today().isoformat()}',
        'instrument': 'ipip-neo-120-johnson-2014-v1',
        'source': 'Kajonius, P. J. & Johnson, J. A. (2019). IPIP-NEO-120 data. PsychArchives. doi:10.23668/psycharchives.2448. CC BY 4.0. Aggregated by Fem; not endorsed by the authors.',
        'sourceSha256': sha.hexdigest(),
        'filters': {'country': a.country, 'complete': 'all 120 items 1-5', 'age': [a.min_age, a.max_age]},
        'collected': '2001-2011',
        'n': kept,
        'domains': {d: dist(c, 24, 120) for d, c in domains.items()},
        'facets': {f: dist(c, 4, 20) for f, c in facets.items()},
    }
    pathlib.Path(a.out).write_text(json.dumps(out, separators=(',', ':')) + '\n')
    print('wrote', a.out)


if __name__ == '__main__':
    main()
