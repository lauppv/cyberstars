```py
import heapq

# vecini[u] are perechi (v, cost): un cablu intre u si v pe care semnalul merge cost minute.
def timp_semnal(vecini, s):
    distanta = [-1] * len(vecini)
    distanta[s] = 0
    heap = [(0, s)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > distanta[u]:
            continue
        for v, cost in vecini[u]:
            if distanta[v] == -1 or d + cost < distanta[v]:
                distanta[v] = d + cost
                heapq.heappush(heap, (distanta[v], v))
    if -1 in distanta:
        return -1
    return max(distanta)
```
