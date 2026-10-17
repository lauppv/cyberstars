```py
from collections import deque


# grila[r][c] e celula de pe randul r, coloana c.
def cei_mai_putini_pasi(grila):
    randuri = len(grila)
    coloane = len(grila[0])
    dist = [[-1] * coloane for r in range(randuri)]
    coada = deque()
    for r in range(randuri):
        for c in range(coloane):
            if grila[r][c] == "A":
                dist[r][c] = 0
                coada.append((r, c))
    while coada:
        cr, cc = coada.popleft()
        if grila[cr][cc] == "B":
            return dist[cr][cc]
        for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
            if 0 <= nr < randuri and 0 <= nc < coloane:
                if grila[nr][nc] != "#" and dist[nr][nc] == -1:
                    dist[nr][nc] = dist[cr][cc] + 1
                    coada.append((nr, nc))
    return -1


randuri, coloane = map(int, input().split())
grila = [list(input()) for r in range(randuri)]
print(cei_mai_putini_pasi(grila))
```
