```py
n, m = map(int, input().split())
vecini = [[] for i in range(n)]
grad = [0] * n
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    grad[v] += 1

facut = [False] * n
ordine = []
for pas in range(n):
    u = -1
    for v in range(n):
        if not facut[v] and grad[v] == 0:
            u = v
            break
    if u == -1:
        break
    facut[u] = True
    ordine.append(u)
    for v in vecini[u]:
        grad[v] -= 1

if len(ordine) == n:
    print("Ordine:", *ordine)
else:
    print("No ordine, there is a cycle")
```
