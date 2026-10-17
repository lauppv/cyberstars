# grid[r][c] is the cell in row r, column c.
def fewest_steps(grid):
    # Write your code here
    return -1


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
print(fewest_steps(grid))
