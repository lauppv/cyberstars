n, m = map(int, input().split())
matrix = [[0] * n for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    matrix[u][v] = 1
    matrix[v][u] = 1

print("Matrix:")
for row in matrix:
    print(*row)

print("List:")
for v in range(n):
    print(f"{v}:", *[u for u in range(n) if matrix[v][u] == 1])
