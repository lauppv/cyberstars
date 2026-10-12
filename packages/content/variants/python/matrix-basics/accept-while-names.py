grid = [
    [5, 8, 3, 6],
    [9, 2, 7, 8],
    [1, 4, 6, 4],
    [10, 9, 8, 10],
]

r = 0
top = None
count = 0
while r < len(grid):
    s = 0
    c = 0
    while c < len(grid[r]):
        x = grid[r][c]
        s += x
        if top is None or x > top:
            top = x
        if x > 7:
            count += 1
        c += 1
    print("Row", r + 1, end=": ")
    print(s)
    r += 1
print("Max:", top)
print("Above 7:", count)
