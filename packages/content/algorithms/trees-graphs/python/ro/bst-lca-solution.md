```py
def stramos_comun(radacina, p, q):
    nod = radacina
    while True:
        if p < nod.valoare and q < nod.valoare:
            nod = nod.stanga
        elif p > nod.valoare and q > nod.valoare:
            nod = nod.dreapta
        else:
            return nod.valoare
```
