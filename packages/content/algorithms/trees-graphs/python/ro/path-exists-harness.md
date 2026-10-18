```py
{{code: exista_drum}}


n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)
s, t = map(int, input().split())
print("true" if exista_drum(vecini, s, t) else "false")
```
