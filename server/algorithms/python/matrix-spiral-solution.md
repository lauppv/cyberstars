```py
n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]

top, bottom = 0, n - 1
left, right = 0, n - 1
result = []

while top <= bottom and left <= right:
    for col in range(left, right + 1):
        result.append(matrix[top][col])
    top += 1

    for row in range(top, bottom + 1):
        result.append(matrix[row][right])
    right -= 1

    if top <= bottom:
        for col in range(right, left - 1, -1):
            result.append(matrix[bottom][col])
        bottom -= 1

    if left <= right:
        for row in range(bottom, top - 1, -1):
            result.append(matrix[row][left])
        left += 1

print(' '.join(str(x) for x in result))
```
