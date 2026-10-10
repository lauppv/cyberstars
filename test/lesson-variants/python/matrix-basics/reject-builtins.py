grid = [
    [5, 8, 3, 6],
    [9, 2, 7, 8],
    [1, 4, 6, 4],
    [10, 9, 8, 10],
]


def flatten(g):
    return [v for row in g for v in row]


for n, row in enumerate(grid, start=1):
    print(f"Row {n}: {sum(row)}")
cells = flatten(grid)
print(f"Max: {max(cells)}")
print(f"Above 7: {len([v for v in cells if v > 7])}")
