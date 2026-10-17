# adj[u] lists the courses that need u first.
def course_order(adj):
    n = len(adj)
    indeg = [0] * n
    for u in range(n):
        for v in adj[u]:
            indeg[v] += 1
    done = [False] * n
    order = []
    for step in range(n):
        u = -1
        for v in range(n):
            if not done[v] and indeg[v] == 0:
                u = v
                break
        if u == -1:
            return []
        done[u] = True
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
    return order


n, m = map(int, input().split())
adj = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
order = course_order(adj)
if order:
    print(*order)
else:
    print(-1)
