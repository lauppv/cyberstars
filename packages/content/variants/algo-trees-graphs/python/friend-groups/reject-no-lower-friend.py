# adj[u] lists the neighbours of vertex u.
def count_groups(adj):
    groups = 0
    for u in range(len(adj)):
        if all(v > u for v in adj[u]):
            groups += 1
    return groups
