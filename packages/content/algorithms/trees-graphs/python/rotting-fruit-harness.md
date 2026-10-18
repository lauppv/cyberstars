```py
{{code: minutes_to_rot}}


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
print(minutes_to_rot(grid))
```
