```py
n, m = map(int, input().split())
matrice = [[0] * n for i in range(n)]
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    matrice[u][v] = 1
    matrice[v][u] = 1
    vecini[u].append(v)
    vecini[v].append(u)

print("Matrice:")
for rand in matrice:
    print(*rand)

print("Lista:")
for v in range(n):
    print(f"{v}:", *vecini[v])
```
