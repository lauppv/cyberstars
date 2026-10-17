# vecini[u] are vecinii nodului u.
def numara_grupuri(vecini):
    # Scrie codul tau aici
    return 0


n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)
print(numara_grupuri(vecini))
