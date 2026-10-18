from collections import deque

# adj[u] lists (v, w) pairs: a cable between u and v that takes w minutes.
def signal_time(adj, s):
    dist = [-1] * len(adj)
    dist[s] = 0
    queue = deque([s])
    while queue:
        u = queue.popleft()
        for v, w in adj[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + w
                queue.append(v)
    if -1 in dist:
        return -1
    return max(dist)
