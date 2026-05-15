Combine **recursion**, **matrices (2D lists)**, and **binary search**

---

Build a **dungeon explorer**. You have a dungeon map (a 2D list) where:
- **0** = empty path
- **1** = wall
- **2** = treasure

```python
dungeon = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2]
]
```

Write these functions:

**count_treasures(dungeon)** — use nested loops on the matrix to count how many treasures (2s) exist

**flatten_sorted(dungeon)** — flatten the 2D list into a sorted 1D list of all unique values

**find_value(sorted_list, target)** — use **binary search** (recursive!) to check if a value exists in the sorted list. Return True/False

**count_paths(dungeon, row, col)** — BONUS: use **recursion** to count how many cells are reachable from position (0,0) by moving only right or down on empty cells (value 0 or 2). Mark visited cells to avoid counting twice

Test with:
```python
print(f"Treasures: {count_treasures(dungeon)}")
flat = flatten_sorted(dungeon)
print(f"Unique values: {flat}")
print(f"Has treasure value: {find_value(flat, 2)}")
print(f"Has value 3: {find_value(flat, 3)}")
```

Expected output
```text
Treasures: 1
Unique values: [0, 1, 2]
Has treasure value: True
Has value 3: False
```
