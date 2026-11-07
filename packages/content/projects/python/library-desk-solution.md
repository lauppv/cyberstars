```python
USAGE = {
    'find': 'find <word>',
    'borrow': 'borrow <member> <id> <day>',
    'return': 'return <member> <id> <day>',
    'pay': 'pay <member> <amount>',
    'member': 'member <name>',
    'report': 'report <day>',
}
WORDS = {'find': 2, 'borrow': 4, 'return': 4, 'pay': 3, 'member': 2, 'report': 2}

books = {}
members = {}
times_borrowed = {}


def line(book_id):
    b = books[book_id]
    return f"{book_id} | {b['title']} by {b['author']} | {b['shelf']} of {b['copies']} on the shelf"


def days(n):
    return f"{n} day" if n == 1 else f"{n} days"


n = int(input())
for _ in range(n):
    book_id, title, author, copies = input().split('|')
    books[book_id] = {'title': title, 'author': author, 'copies': int(copies), 'shelf': int(copies)}
print(f'Loaded {n} books')

while True:
    text = input().strip()
    if text == 'quit':
        print('Goodbye')
        break
    if text == '':
        continue
    parts = text.split()
    cmd = parts[0]
    if cmd == 'list':
        for book_id in sorted(books, key=lambda i: books[i]['title']):
            print(line(book_id))
        continue
    if cmd not in WORDS:
        print(f'Unknown command: {cmd}')
        continue
    if len(parts) != WORDS[cmd]:
        print('Usage: ' + USAGE[cmd])
        continue
    try:
        if cmd in ('borrow', 'return'):
            day = int(parts[3])
        elif cmd == 'report':
            day = int(parts[1])
        elif cmd == 'pay':
            amount = float(parts[2])
    except ValueError:
        print('Usage: ' + USAGE[cmd])
        continue

    if cmd == 'find':
        word = parts[1].lower()
        found = [i for i in books if word in books[i]['title'].lower() or word in books[i]['author'].lower()]
        if not found:
            print(f'No books match "{parts[1]}"')
        for book_id in sorted(found, key=lambda i: books[i]['title']):
            print(line(book_id))
    elif cmd == 'borrow':
        name, book_id = parts[1], parts[2]
        m = members.get(name)
        if m and m['owes'] > 5:
            print(f"{name} owes {m['owes']:.2f}, pay first")
        elif book_id not in books:
            print(f'No book with ID {book_id}')
        elif books[book_id]['shelf'] == 0:
            print(f'No copies of "{books[book_id]["title"]}" left')
        elif m and book_id in m['loans']:
            print(f'{name} already has "{books[book_id]["title"]}"')
        elif m and len(m['loans']) == 3:
            print(f'{name} already has 3 books')
        else:
            m = members.setdefault(name, {'loans': {}, 'owes': 0.0})
            m['loans'][book_id] = day + 14
            books[book_id]['shelf'] -= 1
            times_borrowed[book_id] = times_borrowed.get(book_id, 0) + 1
            print(f'{name} borrowed "{books[book_id]["title"]}", due on day {day + 14}')
    elif cmd == 'return':
        name, book_id = parts[1], parts[2]
        m = members.get(name)
        if book_id not in books:
            print(f'No book with ID {book_id}')
        elif not m or book_id not in m['loans']:
            print(f'{name} does not have "{books[book_id]["title"]}"')
        else:
            due = m['loans'].pop(book_id)
            books[book_id]['shelf'] += 1
            title = books[book_id]['title']
            if day > due:
                fee = (day - due) * 0.5
                m['owes'] += fee
                print(f'{name} returned "{title}" {days(day - due)} late, fee {fee:.2f}')
            else:
                print(f'{name} returned "{title}"')
    elif cmd == 'pay':
        name = parts[1]
        m = members.get(name)
        if not m:
            print(f'No member named {name}')
        elif amount > m['owes'] + 1e-9:
            print(f"{name} owes only {m['owes']:.2f}")
        else:
            m['owes'] -= amount
            print(f"{name} paid {amount:.2f}, owes {m['owes']:.2f}")
    elif cmd == 'member':
        name = parts[1]
        m = members.get(name)
        if not m:
            print(f'No member named {name}')
            continue
        print(f'Member: {name}')
        print(f"Loans: {len(m['loans'])}")
        for book_id in sorted(m['loans'], key=lambda i: (m['loans'][i], books[i]['title'])):
            print(f"- {books[book_id]['title']}, due on day {m['loans'][book_id]}")
        print(f"Owes: {m['owes']:.2f}")
    elif cmd == 'report':
        print(f'Report for day {day}')
        print(f"Books out: {sum(b['copies'] - b['shelf'] for b in books.values())}")
        overdue = []
        for name in members:
            for book_id, due in members[name]['loans'].items():
                if due < day:
                    overdue.append((name, books[book_id]['title'], day - due))
        if not overdue:
            print('Overdue: none')
        for name, title, late in sorted(overdue):
            print(f'Overdue: {name} - {title} ({days(late)})')
        if not times_borrowed:
            print('Most borrowed: none')
        else:
            top = sorted(times_borrowed, key=lambda i: (-times_borrowed[i], books[i]['title']))[0]
            count = times_borrowed[top]
            print(f"Most borrowed: {books[top]['title']} ({count} {'time' if count == 1 else 'times'})")
        print(f"Fees owed: {sum(m['owes'] for m in members.values()):.2f}")
```
