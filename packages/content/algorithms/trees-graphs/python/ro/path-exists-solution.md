```py
from collections import deque

# vecini[u] are vecinii nodului u.
def exista_drum(vecini, s, t):
    vazut = [False] * len(vecini)
    vazut[s] = True
    coada = deque([s])
    while coada:
        u = coada.popleft()
        if u == t:
            return True
        for v in vecini[u]:
            if not vazut[v]:
                vazut[v] = True
                coada.append(v)
    return False
```
