```py
from collections import deque

# grid[r][c] is the cell in row r, column c.
def count_islands(grid):
    rows = len(grid)
    cols = len(grid[0])
    seen = [[False] * cols for r in range(rows)]
    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] != "#" or seen[r][c]:
                continue
            islands += 1
            seen[r][c] = True
            queue = deque([(r, c)])
            while queue:
                cr, cc = queue.popleft()
                for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
                    if 0 <= nr < rows and 0 <= nc < cols:
                        if grid[nr][nc] == "#" and not seen[nr][nc]:
                            seen[nr][nc] = True
                            queue.append((nr, nc))
    return islands
```
