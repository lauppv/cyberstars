```py
# grila[r][c] e celula de pe randul r, coloana c.
def umple_zona(grila, r, c, culoare):
    veche = grila[r][c]
    if veche == culoare:
        return
    grila[r][c] = culoare
    stiva = [(r, c)]
    while stiva:
        cr, cc = stiva.pop()
        for nr, nc in ((cr - 1, cc), (cr + 1, cc), (cr, cc - 1), (cr, cc + 1)):
            if 0 <= nr < len(grila) and 0 <= nc < len(grila[0]) and grila[nr][nc] == veche:
                grila[nr][nc] = culoare
                stiva.append((nr, nc))


randuri, coloane = map(int, input().split())
grila = [list(input()) for r in range(randuri)]
r, c, culoare = input().split()
umple_zona(grila, int(r), int(c), culoare)
for rand in grila:
    print("".join(rand))
```
