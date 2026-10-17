# vecini[u] are cursurile care au nevoie intai de u.
def ordine_cursuri(vecini):
    # Scrie codul tau aici
    return []


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
