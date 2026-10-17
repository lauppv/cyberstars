n, m = map(int, input().split())
indeg = [0] * n
for i in range(m):
    u, v = map(int, input().split())
    indeg[v] += 1

order = sorted(range(n), key=lambda v: indeg[v])
print("Order:", *order)
