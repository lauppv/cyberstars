```py
{{code: oglindeste}}


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


# Scrie un arbore inapoi pe o linie, nivel cu nivel, ca la intrare.
def arbore_in_linie(radacina):
    if radacina is None:
        return "null"
    bucati = [str(radacina.valoare)]
    # Cate bucati se termina cu o valoare: null-urile de dupa ea se lasa deoparte.
    pastrat = 1
    coada = deque([radacina])
    while coada:
        nod = coada.popleft()
        for copil in (nod.stanga, nod.dreapta):
            if copil is None:
                bucati.append("null")
            else:
                bucati.append(str(copil.valoare))
                pastrat = len(bucati)
                coada.append(copil)
    return " ".join(bucati[:pastrat])


radacina = construieste_arbore(input())
print(arbore_in_linie(oglindeste(radacina)))
```
