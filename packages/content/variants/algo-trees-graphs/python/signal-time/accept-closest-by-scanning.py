# adj[u] lists (v, w) pairs: a cable between u and v that takes w minutes.
def signal_time(adj, s):
    n = len(adj)
    dist = [-1] * n
    done = [False] * n
    dist[s] = 0
    for step in range(n):
        u = -1
        for v in range(n):
            if not done[v] and dist[v] != -1 and (u == -1 or dist[v] < dist[u]):
                u = v
        if u == -1:
            return -1
        done[u] = True
        for v, w in adj[u]:
            if dist[v] == -1 or dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    return max(dist)
