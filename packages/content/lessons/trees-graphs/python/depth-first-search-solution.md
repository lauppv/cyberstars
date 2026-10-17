```py
n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

piece = [0] * n


def dfs(u, p):
    piece[u] = p
    for v in adj[u]:
        if piece[v] == 0:
            dfs(v, p)


count = 0
for v in range(n):
    if piece[v] == 0:
        count += 1
        dfs(v, count)

print(f"Pieces: {count}")
for p in range(1, count + 1):
    print(f"Piece {p}:", *[v for v in range(n) if piece[v] == p])
```
