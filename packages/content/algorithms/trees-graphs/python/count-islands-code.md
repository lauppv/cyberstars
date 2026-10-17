# grid[r][c] is the cell in row r, column c.
def count_islands(grid):
    # Write your code here
    return 0


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
print(count_islands(grid))
