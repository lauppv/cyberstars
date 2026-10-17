from collections import deque

n, m = map(int, input().split())
adj = [[] for i in range(n)]
indeg = [0] * n
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    indeg[v] += 1

queue = deque(v for v in range(n) if indeg[v] == 0)
order = []
while queue:
    u = queue.popleft()
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            queue.append(v)

if len(order) == n:
    print("Order:", *order)
else:
    print("No order, there is a cycle")
