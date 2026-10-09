Use a **HashMap** to manage an inventory of items and their quantities. Process commands to add items, remove items, and check stock.

### Input

- Line 1: number of commands N (0 ≤ N ≤ 200)
- For each command:
  - Line 1: command type (`add`, `remove`, or `check`)
  - Line 2: the item name (a single word of letters and digits, at most 20 characters; `apple` and `Apple` are different items)
  - Only for `add` and `remove`, line 3: the quantity (integer, 0 ≤ quantity ≤ 10^5; never negative, but it can be 0)

### Output

- For each `check` command: print `ITEM: QTY`
- For each failed `remove`: print `Not enough ITEM`
- Last line: `Items: N` (total number of distinct items with qty > 0)

### Examples

```
Input:
5
add
apple
10
add
banana
5
remove
apple
3
check
apple
check
orange

Output:
apple: 7
orange: 0
Items: 2
```

```
Input:
3
add
milk
2
remove
milk
5
check
milk

Output:
Not enough milk
milk: 2
Items: 1
```

```
Input:
4
add
apple
3
remove
apple
3
check
apple
check
apple

Output:
apple: 0
apple: 0
Items: 0
```

Removing exactly all of an item's stock brings it to 0. It stays known but
no longer counts toward `Items: N`.
