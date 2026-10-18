```py
{{code: ordine_cursuri}}


n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
ordine = ordine_cursuri(vecini)
if ordine:
    print(*ordine)
else:
    print(-1)
```
