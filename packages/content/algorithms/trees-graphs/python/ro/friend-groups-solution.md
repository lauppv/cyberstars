```py
# vecini[u] are vecinii nodului u.
def numara_grupuri(vecini):
    vazut = [False] * len(vecini)
    grupuri = 0
    for start in range(len(vecini)):
        if vazut[start]:
            continue
        grupuri += 1
        vazut[start] = True
        stiva = [start]
        while stiva:
            u = stiva.pop()
            for v in vecini[u]:
                if not vazut[v]:
                    vazut[v] = True
                    stiva.append(v)
    return grupuri


n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)
print(numara_grupuri(vecini))
```
