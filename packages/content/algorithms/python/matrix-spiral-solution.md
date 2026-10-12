```py
n = int(input())

# Read n rows, each with n numbers.
matrix = []
i = 0
while i < n:
    parts = input().split()
    row = []
    j = 0
    while j < n:
        row.append(int(parts[j]))
        j = j + 1
    matrix.append(row)
    i = i + 1

# We keep four bounds: top, bottom, left, right. On each iteration we walk
# the current layer in 4 directions, then shrink the bounds inward.
top = 0
bottom = n - 1
left = 0
right = n - 1

result = []

while top <= bottom and left <= right:
    # Top row: left -> right.
    col = left
    while col <= right:
        result.append(matrix[top][col])
        col = col + 1
    top = top + 1

    # Right column: top -> bottom.
    row = top
    while row <= bottom:
        result.append(matrix[row][right])
        row = row + 1
    right = right - 1

    # Bottom row: right -> left. Only if we still have rows left.
    if top <= bottom:
        col = right
        while col >= left:
            result.append(matrix[bottom][col])
            col = col - 1
        bottom = bottom - 1

    # Left column: bottom -> top. Only if we still have columns left.
    if left <= right:
        row = bottom
        while row >= top:
            result.append(matrix[row][left])
            row = row - 1
        left = left + 1

# Build the output manually, separated by spaces.
out = ""
i = 0
while i < len(result):
    out = out + str(result[i])
    if i < len(result) - 1:
        out = out + " "
    i = i + 1

print(out)
```
