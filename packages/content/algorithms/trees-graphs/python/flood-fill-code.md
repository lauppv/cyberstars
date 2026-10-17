# grid[r][c] is the cell in row r, column c.
def flood_fill(grid, r, c, color):
    # Write your code here
    pass


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
r, c, color = input().split()
flood_fill(grid, int(r), int(c), color)
for row in grid:
    print("".join(row))
