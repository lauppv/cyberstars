```py
{{code: count_islands}}


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
print(count_islands(grid))
```
