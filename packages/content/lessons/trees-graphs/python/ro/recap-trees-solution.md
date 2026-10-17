```py
from collections import deque


class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def insereaza(nod, valoare):
    if nod is None:
        return Nod(valoare)
    if valoare < nod.valoare:
        nod.stanga = insereaza(nod.stanga, valoare)
    else:
        nod.dreapta = insereaza(nod.dreapta, valoare)
    return nod


def afiseaza_frunze(nod):
    if nod is None:
        return
    if nod.stanga is None and nod.dreapta is None:
        print(nod.valoare, end=" ")
    afiseaza_frunze(nod.stanga)
    afiseaza_frunze(nod.dreapta)


valori = [50, 30, 70, 20, 40, 80]
cautat = 40

radacina = None
for valoare in valori:
    radacina = insereaza(radacina, valoare)

coada = deque()
coada.append(radacina)
nivel = 0
while len(coada) > 0:
    marime = len(coada)
    print(f"Nivelul {nivel}:", end=" ")
    for i in range(marime):
        nod = coada.popleft()
        print(nod.valoare, end=" ")
        if nod.stanga is not None:
            coada.append(nod.stanga)
        if nod.dreapta is not None:
            coada.append(nod.dreapta)
    print()
    nivel += 1

print("Frunze:", end=" ")
afiseaza_frunze(radacina)
print()

print(f"Drum pana la {cautat}:", end=" ")
nod = radacina
while nod.valoare != cautat:
    print(nod.valoare, end=" ")
    if cautat < nod.valoare:
        nod = nod.stanga
    else:
        nod = nod.dreapta
print(nod.valoare)
```
