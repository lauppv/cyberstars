```py
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


def inordine(nod):
    if nod is None:
        return
    inordine(nod.stanga)
    print(nod.valoare, end=" ")
    inordine(nod.dreapta)


def inaltime(nod):
    if nod is None:
        return -1
    return 1 + max(inaltime(nod.stanga), inaltime(nod.dreapta))


def cauta(nod, cautat):
    if nod is None:
        return False
    if cautat == nod.valoare:
        return True
    if cautat < nod.valoare:
        return cauta(nod.stanga, cautat)
    return cauta(nod.dreapta, cautat)


valori = [50, 30, 70, 20, 40, 60, 80]
cautat = 60

radacina = None
for valoare in valori:
    radacina = insereaza(radacina, valoare)

print("Sortat:", end=" ")
inordine(radacina)
print()
print("Inaltime:", inaltime(radacina))
if cauta(radacina, cautat):
    print(f"Cautare {cautat}: gasit")
else:
    print(f"Cautare {cautat}: negasit")
```
