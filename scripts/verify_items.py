"""Compare every English item and key with the saved public-domain original."""
from pathlib import Path
from html import unescape
import json, re, hashlib

root = Path(__file__).resolve().parents[1]
source = root / 'research/upstream/johnson-key.html'
html = source.read_text(encoding='utf-8')
def plain(s):
    return re.sub(r'\s+', ' ', unescape(re.sub('<[^>]+>', '', s))).strip()
def normalized(s):
    return s.strip().rstrip('.').casefold().replace('’', "'")
original = {}
facet = None
key = None
for row in re.findall(r'<tr[^>]*>(.*?)</tr>', html, re.S | re.I):
    cells = [plain(c) for c in re.findall(r'<td[^>]*>(.*?)</td>', row, re.S | re.I)]
    if not cells: continue
    match = re.match(r'^([NEOAC][1-6]):', cells[0])
    if match:
        facet, key = match[1], None
    elif len(cells) == 2 and facet and cells[1]:
        if 'keyed' in cells[0]:
            key = 'plus' if '+' in cells[0] else 'minus'
        if key:
            original[normalized(cells[1])] = (facet, key)
questions = json.loads((root/'app/data/questions.json').read_text(encoding='utf-8-sig'))
assert len(original) == len(questions) == 120, (len(original),len(questions))
assert len({q['id'] for q in questions}) == 120
for q in questions:
    assert original[normalized(q['text'])] == (q['domain']+str(q['facet']), q['keyed']), q
norwegian = json.loads((root/'app/data/questions-no.json').read_text(encoding='utf-8-sig'))
assert len(norwegian) == 120
for en, no in zip(questions, norwegian):
    assert all(en[k] == no[k] for k in ('id','domain','facet','keyed'))
    assert no['text'].strip()
print('PASS: all 120 English texts, facet assignments and keys match the original (terminal punctuation normalized).')
print('PASS: all 120 Norwegian identifiers, facet assignments and keys match English.')
for path in [source,root/'app/data/questions.json',root/'app/data/questions-no.json']:
    print(hashlib.sha256(path.read_bytes()).hexdigest(), path.relative_to(root))
