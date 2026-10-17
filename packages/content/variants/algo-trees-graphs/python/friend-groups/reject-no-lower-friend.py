# adj[u] lists the neighbours of vertex u.
def count_groups(adj):
    groups = 0
    for u in range(len(adj)):
        if all(v > u for v in adj[u]):
            groups += 1
    return groups


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
print(count_groups(adj))
