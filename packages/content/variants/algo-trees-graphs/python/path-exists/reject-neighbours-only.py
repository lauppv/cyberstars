# adj[u] lists the neighbours of vertex u.
def path_exists(adj, s, t):
    return s == t or t in adj[s]
