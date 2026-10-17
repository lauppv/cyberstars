# grila[r][c] e celula de pe randul r, coloana c.
def cei_mai_putini_pasi(grila):
    # Scrie codul tau aici
    return -1


randuri, coloane = map(int, input().split())
grila = [list(input()) for r in range(randuri)]
print(cei_mai_putini_pasi(grila))
