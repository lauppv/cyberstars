# grid[r][c] is the cell in row r, column c.
def count_islands(grid):
    corners = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] != "#":
                continue
            up = r > 0 and grid[r - 1][c] == "#"
            left = c > 0 and grid[r][c - 1] == "#"
            if not up and not left:
                corners += 1
    return corners
