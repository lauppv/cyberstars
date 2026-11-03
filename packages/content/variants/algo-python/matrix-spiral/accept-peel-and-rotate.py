n = int(input())
grid = [list(map(int, input().split())) for _ in range(n)]
order = []
while grid:
    order.extend(grid.pop(0))
    grid = [list(row) for row in zip(*grid)][::-1]
print(*order)
