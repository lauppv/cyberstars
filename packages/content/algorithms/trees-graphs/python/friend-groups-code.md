# adj[u] lists the neighbours of vertex u.
def count_groups(adj):
    # Write your code here
    return 0


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
print(count_groups(adj))
