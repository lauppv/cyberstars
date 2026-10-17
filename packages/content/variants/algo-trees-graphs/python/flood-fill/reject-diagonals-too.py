# grid[r][c] is the cell in row r, column c.
def paint(grid, r, c, old, color):
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != old:
        return
    grid[r][c] = color
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            paint(grid, r + dr, c + dc, old, color)


def flood_fill(grid, r, c, color):
    if grid[r][c] != color:
        paint(grid, r, c, grid[r][c], color)


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
r, c, color = input().split()
flood_fill(grid, int(r), int(c), color)
for row in grid:
    print("".join(row))
