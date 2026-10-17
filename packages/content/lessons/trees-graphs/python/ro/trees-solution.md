```py
class Nod:
    def __init__(self, valoare):
        self.valoare = valoare
        self.stanga = None
        self.dreapta = None


a = 8
b = 3
c = 10
d = 1
e = 6

radacina = Nod(a)
radacina.stanga = Nod(b)
radacina.dreapta = Nod(c)
radacina.stanga.stanga = Nod(d)
radacina.stanga.dreapta = Nod(e)

print("Radacina:", radacina.valoare)
print("Copii:", radacina.stanga.valoare, radacina.dreapta.valoare)
print("Frunze:", radacina.stanga.stanga.valoare, radacina.stanga.dreapta.valoare, radacina.dreapta.valoare)
```
