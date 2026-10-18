# grid[r][c] is the cell in row r, column c.
def fewest_steps(grid):
    rows = len(grid)
    cols = len(grid[0])
    seen = [[cell == "A" for cell in row] for row in grid]
    frontier = [(r, c) for r in range(rows) for c in range(cols) if grid[r][c] == "A"]
    steps = 0
    while frontier:
        following = []
        for r, c in frontier:
            if grid[r][c] == "B":
                return steps
            for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
                if 0 <= nr < rows and 0 <= nc < cols:
                    if grid[nr][nc] != "#" and not seen[nr][nc]:
                        seen[nr][nc] = True
                        following.append((nr, nc))
        frontier = following
        steps += 1
    return -1
