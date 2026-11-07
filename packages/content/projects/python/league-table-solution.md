```python
def parse(line):
    parts = line.split()
    if len(parts) != 3 or parts[0] == parts[2]:
        return None
    goals = parts[1].split('-')
    if len(goals) != 2 or not goals[0].isdigit() or not goals[1].isdigit():
        return None
    return parts[0], int(goals[0]), int(goals[1]), parts[2]


matches = []
skipped = []
number = 0
while True:
    try:
        line = input()
    except EOFError:
        break
    number += 1
    if line.strip() == '':
        continue
    match = parse(line)
    if match is None:
        skipped.append((number, line.strip()))
    else:
        matches.append(match)

print(f"{len(matches)} {'match' if len(matches) == 1 else 'matches'} read")
for number, line in skipped:
    print(f'Line {number} skipped: {line}')

teams = {}
for home, hg, ag, away in matches:
    for team, scored, let_in in ((home, hg, ag), (away, ag, hg)):
        t = teams.setdefault(team, {'p': 0, 'w': 0, 'd': 0, 'l': 0, 'gf': 0, 'ga': 0, 'form': ''})
        t['p'] += 1
        t['gf'] += scored
        t['ga'] += let_in
        result = 'W' if scored > let_in else 'D' if scored == let_in else 'L'
        t[{'W': 'w', 'D': 'd', 'L': 'l'}[result]] += 1
        t['form'] += result

if not teams:
    print('No table yet')
else:
    def points(t):
        return 3 * t['w'] + t['d']

    order = sorted(teams, key=lambda n: (-points(teams[n]), -(teams[n]['gf'] - teams[n]['ga']), -teams[n]['gf'], n))
    width = max(4, max(len(n) for n in teams))
    print()
    print(f"{'Pos':>3}  {'Team':<{width}}  {'P':>2} {'W':>2} {'D':>2} {'L':>2} {'GF':>3} {'GA':>3} {'GD':>4} {'Pts':>4}  Form")
    for pos, name in enumerate(order, 1):
        t = teams[name]
        print(f"{pos:>3}  {name:<{width}}  {t['p']:>2} {t['w']:>2} {t['d']:>2} {t['l']:>2} "
              f"{t['gf']:>3} {t['ga']:>3} {t['gf'] - t['ga']:>+4} {points(t):>4}  {t['form'][-3:]}")
    print()
    best = max(range(len(matches)), key=lambda i: (abs(matches[i][1] - matches[i][2]), -i))
    most = max(range(len(matches)), key=lambda i: (matches[i][1] + matches[i][2], -i))
    for label, i in (('Biggest win', best), ('Most goals', most)):
        home, hg, ag, away = matches[i]
        print(f'{label}: {home} {hg}-{ag} {away}')
    total = sum(m[1] + m[2] for m in matches)
    print(f'Goals per match: {total / len(matches):.2f}')
```
