n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

seen = [False] * n


def dfs(u, found):
    seen[u] = True
    found.append(u)
    for v in adj[u]:
        if not seen[v]:
            dfs(v, found)


pieces = []
for v in range(n):
    if not seen[v]:
        found = []
        dfs(v, found)
        pieces.append(found)

print(f"Pieces: {len(pieces)}")
for p in range(len(pieces)):
    print(f"Piece {p + 1}:", *pieces[p])
