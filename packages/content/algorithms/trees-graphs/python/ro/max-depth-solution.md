```py
from collections import deque


class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


# Face dintr-o linie ca "8 4 11 2 null 9 15" noduri legate, nivel cu nivel.
def construieste_arbore(linie):
    bucati = linie.split()
    if not bucati or bucati[0] == "null":
        return None
    radacina = Nod(int(bucati[0]))
    coada = deque([radacina])
    i = 1
    while i < len(bucati):
        nod = coada.popleft()
        if bucati[i] != "null":
            nod.stanga = Nod(int(bucati[i]))
            coada.append(nod.stanga)
        i += 1
        if i < len(bucati) and bucati[i] != "null":
            nod.dreapta = Nod(int(bucati[i]))
            coada.append(nod.dreapta)
        i += 1
    return radacina


def adancime_maxima(radacina):
    if radacina is None:
        return 0
    return 1 + max(adancime_maxima(radacina.stanga), adancime_maxima(radacina.dreapta))


radacina = construieste_arbore(input())
print(adancime_maxima(radacina))
```
