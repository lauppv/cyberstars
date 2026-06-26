```py
grid = [
    [5, 8, 3, 6],
    [9, 2, 7, 8],
    [1, 4, 6, 4],
    [10, 9, 8, 10],
]

for i in range(len(grid)):
    total = 0
    for value in grid[i]:
        total += value
    print(f"Row {i + 1}: {total}")

biggest = grid[0][0]
above = 0
for row in grid:
    for value in row:
        if value > biggest:
            biggest = value
        if value > 7:
            above += 1

print(f"Max: {biggest}")
print(f"Above 7: {above}")
```
