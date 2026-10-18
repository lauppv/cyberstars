# grid[r][c] is the cell in row r, column c.
def paint(grid, r, c, old, color):
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != old:
        return
    grid[r][c] = color
    paint(grid, r - 1, c, old, color)
    paint(grid, r + 1, c, old, color)
    paint(grid, r, c - 1, old, color)
    paint(grid, r, c + 1, old, color)


def flood_fill(grid, r, c, color):
    if grid[r][c] != color:
        paint(grid, r, c, grid[r][c], color)
