```py
import heapq
from collections import deque

n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v, cost = map(int, input().split())
    vecini[u].append((v, cost))
    vecini[v].append((u, cost))
s = int(input())

bucata = [0] * n


def dfs(u, b):
    bucata[u] = b
    for v, cost in vecini[u]:
        if bucata[v] == 0:
            dfs(v, b)


bucati = 0
for v in range(n):
    if bucata[v] == 0:
        bucati += 1
        dfs(v, bucati)

pasi = [-1] * n
pasi[s] = 0
coada = deque()
coada.append(s)
while len(coada) > 0:
    u = coada.popleft()
    for v, cost in vecini[u]:
        if pasi[v] == -1:
            pasi[v] = pasi[u] + 1
            coada.append(v)

distanta = [-1] * n
distanta[s] = 0
heap = [(0, s)]
while len(heap) > 0:
    d, u = heapq.heappop(heap)
    if d > distanta[u]:
        continue
    for v, cost in vecini[u]:
        if distanta[v] == -1 or d + cost < distanta[v]:
            distanta[v] = d + cost
            heapq.heappush(heap, (distanta[v], v))

print("Bucati:", bucati)
print("Pasi:", *pasi)
print("Distante:", *distanta)
```
