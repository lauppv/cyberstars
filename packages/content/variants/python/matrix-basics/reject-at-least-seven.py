grid = [
    [5, 8, 3, 6],
    [9, 2, 7, 8],
    [1, 4, 6, 4],
    [10, 9, 8, 10],
]

for i, row in enumerate(grid):
    print(f"Row {i + 1}: {sum(row)}")
best = grid[0][0]
above = 0
for row in grid:
    for v in row:
        if v > best:
            best = v
        if v >= 7:
            above += 1
print(f"Max: {best}")
print(f"Above 7: {above}")
