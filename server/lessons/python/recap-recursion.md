Combine **recursion**, **matrices (2D lists)**, and **binary search**

---

## Mission: Sector Scan

A long-range scan returns a **sector map** as a 2D grid (a list of lists, already on the right) where:

- **0** = open space
- **1** = debris
- **2** = beacon

Pull together everything from this chapter — **matrices**, **recursion**, and **binary search**:

**count_beacons(sector)** — use **nested loops** on the grid to count how many beacons (the `2`s) it contains.

**flatten_sorted(sector)** — collapse the 2D grid into a **sorted list of the unique values** that appear in it.

**find_value(sorted_list, target)** — use **recursive binary search** to check whether a value is in the sorted list. Return `True` or `False`.

Test with:

```py
print(f"Beacons: {count_beacons(sector)}")
flat = flatten_sorted(sector)
print(f"Unique values: {flat}")
print(f"Has beacon value: {find_value(flat, 2)}")
print(f"Has value 3: {find_value(flat, 3)}")
```

**Output**

```text
Beacons: 1
Unique values: [0, 1, 2]
Has beacon value: True
Has value 3: False
```
