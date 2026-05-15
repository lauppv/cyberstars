# Medium · Inventory Manager

Use a **HashMap** to manage an inventory of items and their quantities. Process commands to add items, remove items, and check stock.

### Input
- Line 1: number of commands N
- Next N lines: one of:
  - `add item qty` — add qty units of item (or increase if exists)
  - `remove item qty` — remove qty units (if not enough, print `Not enough ITEM`)
  - `check item` — print `ITEM: QTY` (or `ITEM: 0` if not in inventory)

### Output
- For each `check` command: print `ITEM: QTY`
- For each failed `remove`: print `Not enough ITEM`
- Last line: `Items: N` (total number of distinct items with qty > 0)

### Examples

```
Input:
5
add apple 10
add banana 5
remove apple 3
check apple
check orange

Output:
apple: 7
orange: 0
Items: 2
```

```
Input:
3
add milk 2
remove milk 5
check milk

Output:
Not enough milk
milk: 2
Items: 1
```

### Hints
- Use `HashMap<String, Integer>` to store inventory.
- `getOrDefault(item, 0)` is useful for items not yet in the map.
- When removing, check quantity first before subtracting.
- Count only items with quantity > 0 for the final `Items: N` line.
