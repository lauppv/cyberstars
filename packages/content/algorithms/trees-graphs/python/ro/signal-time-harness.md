```py
{{code: timp_semnal}}


n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v, cost = map(int, input().split())
    vecini[u].append((v, cost))
    vecini[v].append((u, cost))
s = int(input())
print(timp_semnal(vecini, s))
```
