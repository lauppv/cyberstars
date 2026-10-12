grid = [
    [5, 8, 3, 6],
    [9, 2, 7, 8],
    [1, 4, 6, 4],
    [10, 9, 8, 10],
]

best = None
above = 0
for n, row in enumerate(grid, start=1):
    row_sum = 0
    for v in row:
        row_sum += v
        if best is None or v > best:
            best = v
        if v > 7:
            above += 1
    print(f"Row {n}: {row_sum}")
print(f"Max: {best}")
print(f"Above 7: {above}")
