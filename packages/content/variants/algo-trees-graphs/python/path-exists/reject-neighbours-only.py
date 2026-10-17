# adj[u] lists the neighbours of vertex u.
def path_exists(adj, s, t):
    return s == t or t in adj[s]


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
s, t = map(int, input().split())
print("true" if path_exists(adj, s, t) else "false")
