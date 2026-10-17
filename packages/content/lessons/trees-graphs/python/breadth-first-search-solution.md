```py
from collections import deque

n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
s, t = map(int, input().split())

dist = [-1] * n
dist[s] = 0
queue = deque()
queue.append(s)
while len(queue) > 0:
    u = queue.popleft()
    for v in adj[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            queue.append(v)

for v in range(n):
    print(f"{v}: {dist[v]}")
if dist[t] == -1:
    print(f"No way from {s} to {t}")
else:
    print(f"Fewest steps from {s} to {t}: {dist[t]}")
```
