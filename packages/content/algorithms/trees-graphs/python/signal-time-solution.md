```py
import heapq


# adj[u] lists (v, w) pairs: a cable between u and v that takes w minutes.
def signal_time(adj, s):
    dist = [-1] * len(adj)
    dist[s] = 0
    heap = [(0, s)]
    while heap:
        d, u = heapq.heappop(heap)
        if d > dist[u]:
            continue
        for v, w in adj[u]:
            if dist[v] == -1 or d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(heap, (dist[v], v))
    if -1 in dist:
        return -1
    return max(dist)


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
    adj[v].append((u, w))
s = int(input())
print(signal_time(adj, s))
```
