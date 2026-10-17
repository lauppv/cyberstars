n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
s = int(input())

dist = [-1] * n
done = [False] * n
dist[s] = 0
for step in range(n):
    u = -1
    for v in range(n):
        if not done[v] and dist[v] != -1 and (u == -1 or dist[v] < dist[u]):
            u = v
    if u == -1:
        break
    done[u] = True
    for v, w in adj[u]:
        if dist[v] == -1 or dist[u] + w < dist[v]:
            dist[v] = dist[u] + w

for v in range(n):
    print(f"{v}: {dist[v]}")
