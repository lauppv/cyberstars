```py
def a_k_a_cea_mai_mica(radacina, k):
    stiva = []
    nod = radacina
    while True:
        while nod is not None:
            stiva.append(nod)
            nod = nod.stanga
        nod = stiva.pop()
        k -= 1
        if k == 0:
            return nod.valoare
        nod = nod.dreapta
```
