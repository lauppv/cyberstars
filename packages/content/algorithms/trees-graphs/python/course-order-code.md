# adj[u] lists the courses that need u first.
def course_order(adj):
    # Write your code here
    return []


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
