# adj[u] lists the neighbours of vertex u.
def path_exists(adj, s, t):
    seen = [False] * len(adj)

    def visit(u):
        seen[u] = True
        for v in adj[u]:
            if not seen[v]:
                visit(v)

    visit(s)
    return seen[t]
