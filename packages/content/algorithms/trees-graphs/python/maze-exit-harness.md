```py
{{code: fewest_steps}}


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
print(fewest_steps(grid))
```
