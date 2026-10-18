```py
from collections import deque

# grila[r][c] e celula de pe randul r, coloana c.
def minute_pana_se_strica(grila):
    randuri = len(grila)
    coloane = len(grila[0])
    minut = [[-1] * coloane for r in range(randuri)]
    coada = deque()
    proaspete = 0
    for r in range(randuri):
        for c in range(coloane):
            if grila[r][c] == "x":
                minut[r][c] = 0
                coada.append((r, c))
            elif grila[r][c] == "o":
                proaspete += 1
    ultimul = 0
    while coada:
        cr, cc = coada.popleft()
        for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
            if 0 <= nr < randuri and 0 <= nc < coloane:
                if grila[nr][nc] == "o" and minut[nr][nc] == -1:
                    minut[nr][nc] = minut[cr][cc] + 1
                    ultimul = minut[nr][nc]
                    proaspete -= 1
                    coada.append((nr, nc))
    if proaspete > 0:
        return -1
    return ultimul
```
