```py
import heapq

n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
s = int(input())

dist = [-1] * n
dist[s] = 0
heap = [(0, s)]
while len(heap) > 0:
    d, u = heapq.heappop(heap)
    if d > dist[u]:
        continue
    for v, w in adj[u]:
        if dist[v] == -1 or d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(heap, (dist[v], v))

for v in range(n):
    print(f"{v}: {dist[v]}")
```
