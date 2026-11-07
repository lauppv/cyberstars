```python
def read_list(text, label):
    value = text[len(label):].strip()
    return [] if value == 'none' else [v.strip() for v in value.split(',')]


rooms = {}
n = int(input())
for _ in range(n):
    room_id, name = input().split('|')
    description = input()
    exits = {}
    for pair in read_list(input(), 'exits:'):
        direction, target = pair.split('=')
        exits[direction] = target
    rooms[room_id] = {'name': name, 'description': description, 'exits': exits, 'items': read_list(input(), 'items:')}
locks = {}
for _ in range(int(input())):
    room_id, direction, item = input().split()
    locks[(room_id, direction)] = item
dark = set(read_list(input(), 'dark:'))
goal_item, goal_room = input()[len('goal:'):].split()
here = input().split()[1]
inventory = []
moves = 0


def can_see():
    return here not in dark or 'lamp' in inventory


def look():
    room = rooms[here]
    print(f"== {room['name']} ==")
    if not can_see():
        print('It is too dark to see.')
        return
    print(room['description'])
    print('Exits: ' + (', '.join(sorted(room['exits'])) or 'none'))
    if room['items']:
        print('You see: ' + ', '.join(room['items']))


print(f'World of {n} rooms')
look()
while True:
    words = input().split()
    if not words:
        continue
    verb, rest = words[0], ' '.join(words[1:])
    if verb == 'quit':
        print('Bye')
        break
    elif verb == 'look':
        look()
    elif verb == 'go':
        exits = rooms[here]['exits']
        if rest not in exits:
            print("You can't go that way.")
        elif (here, rest) in locks:
            print(f'The way {rest} is locked.')
        else:
            here = exits[rest]
            moves += 1
            look()
            if here == goal_room and goal_item in inventory:
                print(f"You made it! It took you {moves} {'move' if moves == 1 else 'moves'}.")
                break
    elif verb == 'take':
        if not can_see():
            print("You can't see anything to take.")
        elif rest not in rooms[here]['items']:
            print(f'There is no {rest} here.')
        else:
            rooms[here]['items'].remove(rest)
            inventory.append(rest)
            print(f'You take the {rest}.')
    elif verb == 'drop':
        if rest not in inventory:
            print(f"You don't have a {rest}.")
        else:
            inventory.remove(rest)
            rooms[here]['items'].append(rest)
            print(f'You drop the {rest}.')
    elif verb == 'inventory':
        print('You carry: ' + (', '.join(inventory) if inventory else 'nothing'))
    elif verb == 'unlock':
        item = locks.get((here, rest))
        if item is None:
            print(f'Nothing is locked {rest}.')
        elif item not in inventory:
            print(f'You need the {item}.')
        else:
            del locks[(here, rest)]
            print(f'You unlock the way {rest} with the {item}.')
    else:
        print("I don't understand that.")
```
