from collections import deque

# adj[u] lists the neighbours of vertex u.
def path_exists(adj, s, t):
    seen = [False] * len(adj)
    seen[s] = True
    queue = deque([s])
    while queue:
        u = queue.popleft()
        for v in adj[u]:
            if v == t:
                return True
            if not seen[v]:
                seen[v] = True
                queue.append(v)
    return False
