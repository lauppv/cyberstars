```py
from collections import deque

# grid[r][c] is the cell in row r, column c.
def fewest_steps(grid):
    rows = len(grid)
    cols = len(grid[0])
    dist = [[-1] * cols for r in range(rows)]
    queue = deque()
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "A":
                dist[r][c] = 0
                queue.append((r, c))
    while queue:
        cr, cc = queue.popleft()
        if grid[cr][cc] == "B":
            return dist[cr][cc]
        for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
            if 0 <= nr < rows and 0 <= nc < cols:
                if grid[nr][nc] != "#" and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[cr][cc] + 1
                    queue.append((nr, nc))
    return -1
```
