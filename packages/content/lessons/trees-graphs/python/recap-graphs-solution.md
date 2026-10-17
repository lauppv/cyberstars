```py
import heapq
from collections import deque

n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
s = int(input())

piece = [0] * n


def dfs(u, p):
    piece[u] = p
    for v, w in adj[u]:
        if piece[v] == 0:
            dfs(v, p)


pieces = 0
for v in range(n):
    if piece[v] == 0:
        pieces += 1
        dfs(v, pieces)

steps = [-1] * n
steps[s] = 0
queue = deque()
queue.append(s)
while len(queue) > 0:
    u = queue.popleft()
    for v, w in adj[u]:
        if steps[v] == -1:
            steps[v] = steps[u] + 1
            queue.append(v)

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

print("Pieces:", pieces)
print("Steps:", *steps)
print("Distances:", *dist)
```
