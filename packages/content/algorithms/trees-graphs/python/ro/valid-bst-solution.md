```py
# jos si sus sunt nodurile ale caror valori marginesc subarborele; None inseamna fara margine.
def incape(nod, jos, sus):
    if nod is None:
        return True
    if jos is not None and nod.valoare <= jos.valoare:
        return False
    if sus is not None and nod.valoare >= sus.valoare:
        return False
    return incape(nod.stanga, jos, nod) and incape(nod.dreapta, nod, sus)


def este_arbore_de_cautare(radacina):
    return incape(radacina, None, None)
```
