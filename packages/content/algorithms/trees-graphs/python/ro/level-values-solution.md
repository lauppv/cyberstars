```py
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
```
