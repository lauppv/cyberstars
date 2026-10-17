```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


def preordine(nod):
    if nod is None:
        return
    print(nod.valoare, end=" ")
    preordine(nod.stanga)
    preordine(nod.dreapta)


def inordine(nod):
    if nod is None:
        return
    inordine(nod.stanga)
    print(nod.valoare, end=" ")
    inordine(nod.dreapta)


def postordine(nod):
    if nod is None:
        return
    postordine(nod.stanga)
    postordine(nod.dreapta)
    print(nod.valoare, end=" ")


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
radacina.stanga.dreapta = Nod(e)
radacina.dreapta.dreapta = Nod(f)
radacina.stanga.dreapta.stanga = Nod(g)

print("Preordine:", end=" ")
preordine(radacina)
print()
print("Inordine:", end=" ")
inordine(radacina)
print()
print("Postordine:", end=" ")
postordine(radacina)
print()
```
