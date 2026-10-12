grid = [
    [5, 8, 3, 6],
    [9, 2, 7, 8],
    [1, 4, 6, 4],
    [10, 9, 8, 10],
]

for i in range(4):
    print(f"Row {i + 1}: {grid[i][0] + grid[i][1] + grid[i][2] + grid[i][3]}")
best = 0
above = 0
for row in grid:
    for v in row:
        best = max(best, v)
        if v > 7:
            above += 1
print(f"Max: {best}")
print(f"Above 7: {above}")
