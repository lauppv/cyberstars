# grid[r][c] is the cell in row r, column c.
def minutes_to_rot(grid):
    rows = len(grid)
    cols = len(grid[0])
    minutes = 0
    while True:
        rotting = []
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != "o":
                    continue
                for nr, nc in ((r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)):
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == "x":
                        rotting.append((r, c))
                        break
        if not rotting:
            break
        for r, c in rotting:
            grid[r][c] = "x"
        minutes += 1
    for row in grid:
        if "o" in row:
            return -1
    return minutes


rows, cols = map(int, input().split())
grid = [list(input()) for r in range(rows)]
print(minutes_to_rot(grid))
