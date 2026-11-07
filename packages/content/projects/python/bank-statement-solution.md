```python
rules = []
while True:
    line = input().strip()
    if line == '':
        break
    keyword, category = line.split('=')
    rules.append((keyword.strip().lower(), category.strip()))

header = input()
rows = []
while True:
    try:
        line = input().strip()
    except EOFError:
        break
    if not line:
        continue
    date, rest = line.split(',', 1)
    description, amount = rest.rsplit(',', 1)
    description = description.strip().strip('"')
    cents = round(float(amount) * 100)
    category = 'other'
    for keyword, cat in rules:
        if keyword in description.lower():
            category = cat
            break
    rows.append({'date': date, 'month': date[:7], 'description': description, 'cents': cents, 'category': category})

def money(c):
    return f'{c / 100:.2f}'

print(f'Rules: {len(rules)}, transactions: {len(rows)}')
money_in = sum(r['cents'] for r in rows if r['cents'] > 0)
money_out = -sum(r['cents'] for r in rows if r['cents'] < 0)
print(f'In: {money(money_in)}')
print(f'Out: {money(money_out)}')
print(f'Left: {money(money_in - money_out)}')

spent = {}
for r in rows:
    if r['cents'] < 0:
        spent[r['category']] = spent.get(r['category'], 0) - r['cents']
print()
print('Spending by category:')
if spent:
    width = max(len(c) for c in spent)
    for cat in sorted(spent, key=lambda c: (-spent[c], c)):
        print(f'  {cat:<{width}}  {money(spent[cat]):>9}  {round(spent[cat] * 100 / money_out):>3}%')

months = {}
for r in rows:
    if r['cents'] < 0:
        months[r['month']] = months.get(r['month'], 0) - r['cents']
print()
print('Spending by month:')
for m in sorted(months):
    print(f'  {m}  {money(months[m]):>9}')

print()
print('Biggest expenses:')
out = [r for r in rows if r['cents'] < 0]
for r in sorted(out, key=lambda r: (r['cents'], r['date']))[:3]:
    print(f"  {r['date']}  {r['description']}  {money(-r['cents'])}")

seen = {}
for r in out:
    key = (r['description'], r['cents'])
    seen.setdefault(key, set()).add(r['month'])
subs = [(d, c, len(m)) for (d, c), m in seen.items() if len(m) >= 2]
print()
if not subs:
    print('Subscriptions: none')
else:
    print('Subscriptions:')
    for d, c, n in sorted(subs, key=lambda s: (s[1], s[0])):
        print(f'  {d}  {money(-c)} a month ({n} months)')
```
