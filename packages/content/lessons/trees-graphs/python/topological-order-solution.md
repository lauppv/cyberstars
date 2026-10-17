```py
n, m = map(int, input().split())
adj = [[] for i in range(n)]
indeg = [0] * n
for i in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
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
        break
    done[u] = True
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1

if len(order) == n:
    print("Order:", *order)
else:
    print("No order, there is a cycle")
```
