```py
import heapq

n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v, cost = map(int, input().split())
    vecini[u].append((v, cost))
    vecini[v].append((u, cost))
s = int(input())

dist = [-1] * n
dist[s] = 0
heap = [(0, s)]
while len(heap) > 0:
    d, u = heapq.heappop(heap)
    if d > dist[u]:
        continue
    for v, cost in vecini[u]:
        if dist[v] == -1 or d + cost < dist[v]:
            dist[v] = d + cost
            heapq.heappush(heap, (dist[v], v))

for v in range(n):
    print(f"{v}: {dist[v]}")
```
