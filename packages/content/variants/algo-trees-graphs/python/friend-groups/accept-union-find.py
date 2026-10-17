# adj[u] lists the neighbours of vertex u.
def find(parent, v):
    while parent[v] != v:
        parent[v] = parent[parent[v]]
        v = parent[v]
    return v


def count_groups(adj):
    parent = list(range(len(adj)))
    groups = len(adj)
    for u in range(len(adj)):
        for v in adj[u]:
            a = find(parent, u)
            b = find(parent, v)
            if a != b:
                parent[a] = b
                groups -= 1
    return groups


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
print(count_groups(adj))
