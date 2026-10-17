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


def afiseaza_nivelurile(radacina):
    if radacina is None:
        return
    coada = deque([radacina])
    while coada:
        valori = []
        for _ in range(len(coada)):
            nod = coada.popleft()
            valori.append(str(nod.valoare))
            if nod.stanga is not None:
                coada.append(nod.stanga)
            if nod.dreapta is not None:
                coada.append(nod.dreapta)
        print(" ".join(valori))


radacina = construieste_arbore(input())
afiseaza_nivelurile(radacina)
```
