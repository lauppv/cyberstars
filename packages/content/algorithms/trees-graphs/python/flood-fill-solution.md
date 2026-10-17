```py
# grid[r][c] is the cell in row r, column c.
def flood_fill(grid, r, c, color):
    old = grid[r][c]
    if old == color:
        return
    grid[r][c] = color
    stack = [(r, c)]
    while stack:
        cr, cc = stack.pop()
        for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
            if 0 <= nr < len(grid) and 0 <= nc < len(grid[0]) and grid[nr][nc] == old:
                grid[nr][nc] = color
                stack.append((nr, nc))


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
r, c, color = input().split()
flood_fill(grid, int(r), int(c), color)
for row in grid:
    print("".join(row))
```
