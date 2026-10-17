```py
from collections import deque


# grila[r][c] e celula de pe randul r, coloana c.
def numara_insule(grila):
    randuri = len(grila)
    coloane = len(grila[0])
    vazut = [[False] * coloane for r in range(randuri)]
    insule = 0
    for r in range(randuri):
        for c in range(coloane):
            if grila[r][c] != "#" or vazut[r][c]:
                continue
            insule += 1
            vazut[r][c] = True
            coada = deque([(r, c)])
            while coada:
                cr, cc = coada.popleft()
                for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
                    if 0 <= nr < randuri and 0 <= nc < coloane:
                        if grila[nr][nc] == "#" and not vazut[nr][nc]:
                            vazut[nr][nc] = True
                            coada.append((nr, nc))
    return insule


randuri, coloane = map(int, input().split())
grila = [list(input()) for r in range(randuri)]
print(numara_insule(grila))
```
