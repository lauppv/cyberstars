```py
n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)

bucata = [0] * n


def dfs(u, b):
    bucata[u] = b
    for v in vecini[u]:
        if bucata[v] == 0:
            dfs(v, b)


numar = 0
for v in range(n):
    if bucata[v] == 0:
        numar += 1
        dfs(v, numar)

print(f"Bucati: {numar}")
for b in range(1, numar + 1):
    print(f"Bucata {b}:", *[v for v in range(n) if bucata[v] == b])
```
