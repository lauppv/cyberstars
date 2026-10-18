from collections import deque

# grid[r][c] is the cell in row r, column c.
def minutes_to_rot(grid):
    rows = len(grid)
    cols = len(grid[0])
    minute = [[-1] * cols for r in range(rows)]
    queue = deque()
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "x":
                minute[r][c] = 0
                queue.append((r, c))
    last = 0
    while queue:
        cr, cc = queue.popleft()
        for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
            if 0 <= nr < rows and 0 <= nc < cols:
                if grid[nr][nc] == "o" and minute[nr][nc] == -1:
                    minute[nr][nc] = minute[cr][cc] + 1
                    last = minute[nr][nc]
                    queue.append((nr, nc))
    return last
