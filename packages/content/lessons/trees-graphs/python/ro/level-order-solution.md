```py
from collections import deque


class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


a = 1
b = 2
c = 3
d = 4
e = 5
f = 6
g = 7

radacina = Nod(a)
radacina.stanga = Nod(b)
radacina.dreapta = Nod(c)
radacina.stanga.stanga = Nod(d)
radacina.dreapta.stanga = Nod(e)
radacina.dreapta.dreapta = Nod(f)
radacina.dreapta.stanga.dreapta = Nod(g)

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
```
