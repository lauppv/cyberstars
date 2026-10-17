from collections import deque

n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
s, t = map(int, input().split())

dist = [0] * n
seen = [False] * n
seen[s] = True
dist[s] = 0
queue = deque()
queue.append(s)
while len(queue) > 0:
    u = queue.popleft()
    for v in adj[u]:
        if not seen[v]:
            seen[v] = True
            dist[v] = dist[u] + 1
            queue.append(v)

for v in range(n):
    print(f"{v}: {dist[v]}")
print(f"Fewest steps from {s} to {t}: {dist[t]}")
