```py
import heapq

# vecini[u] are cursurile care au nevoie intai de u.
def ordine_cursuri(vecini):
    n = len(vecini)
    grad = [0] * n
    for u in range(n):
        for v in vecini[u]:
            grad[v] += 1
    gata = [v for v in range(n) if grad[v] == 0]
    heapq.heapify(gata)
    ordine = []
    while gata:
        u = heapq.heappop(gata)
        ordine.append(u)
        for v in vecini[u]:
            grad[v] -= 1
            if grad[v] == 0:
                heapq.heappush(gata, v)
    if len(ordine) < n:
        return []
    return ordine
```
