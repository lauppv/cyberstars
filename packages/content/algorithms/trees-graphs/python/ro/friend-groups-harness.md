```py
{{code: numara_grupuri}}


n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)
print(numara_grupuri(vecini))
```
