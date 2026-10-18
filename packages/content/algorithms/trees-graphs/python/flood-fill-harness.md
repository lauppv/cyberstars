```py
{{code: flood_fill}}


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
r, c, color = input().split()
flood_fill(grid, int(r), int(c), color)
for row in grid:
    print("".join(row))
```
