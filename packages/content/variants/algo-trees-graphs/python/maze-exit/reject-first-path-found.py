# grid[r][c] is the cell in row r, column c.
def fewest_steps(grid):
    rows = len(grid)
    cols = len(grid[0])
    depth = [[-1] * cols for r in range(rows)]
    stack = []
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "A":
                depth[r][c] = 0
                stack.append((r, c))
    while stack:
        cr, cc = stack.pop()
        if grid[cr][cc] == "B":
            return depth[cr][cc]
        for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
            if 0 <= nr < rows and 0 <= nc < cols:
                if grid[nr][nc] != "#" and depth[nr][nc] == -1:
                    depth[nr][nc] = depth[cr][cc] + 1
                    stack.append((nr, nc))
    return -1
