```py
import heapq


# vecini[u] are perechi (v, cost): un cablu intre u si v pe care semnalul merge cost minute.
def timp_semnal(vecini, s):
    dist = [-1] * len(vecini)
    dist[s] = 0
    heap = [(0, s)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, cost in vecini[u]:
            if dist[v] == -1 or d + cost < dist[v]:
                dist[v] = d + cost
                heapq.heappush(heap, (dist[v], v))
    if -1 in dist:
        return -1
    return max(dist)


n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v, cost = map(int, input().split())
    vecini[u].append((v, cost))
    vecini[v].append((u, cost))
s = int(input())
print(timp_semnal(vecini, s))
```
