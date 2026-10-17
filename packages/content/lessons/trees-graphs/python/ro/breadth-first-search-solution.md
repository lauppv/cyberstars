```py
from collections import deque

n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)
s, t = map(int, input().split())

dist = [-1] * n
dist[s] = 0
coada = deque()
coada.append(s)
while len(coada) > 0:
    u = coada.popleft()
    for v in vecini[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            coada.append(v)

for v in range(n):
    print(f"{v}: {dist[v]}")
if dist[t] == -1:
    print(f"Niciun drum de la {s} la {t}")
else:
    print(f"Cei mai putini pasi de la {s} la {t}: {dist[t]}")
```
