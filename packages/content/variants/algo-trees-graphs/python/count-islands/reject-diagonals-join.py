# grid[r][c] is the cell in row r, column c.
def sink(grid, r, c):
    if r < 0 or r >= len(grid) or c < 0 or c >= len(grid[0]) or grid[r][c] != "#":
        return
    grid[r][c] = "."
    for dr in (-1, 0, 1):
        for dc in (-1, 0, 1):
            sink(grid, r + dr, c + dc)


def count_islands(grid):
    islands = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == "#":
                islands += 1
                sink(grid, r, c)
    return islands
