```py
ids = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
interogari = [23, 50, 8, 91, 100]

def cautare_binara(numere, tinta):
    stanga = 0
    dreapta = len(numere) - 1
    while stanga <= dreapta:
        mijloc = (stanga + dreapta) // 2
        if numere[mijloc] == tinta:
            return mijloc
        elif numere[mijloc] < tinta:
            stanga = mijloc + 1
        else:
            dreapta = mijloc - 1
    return -1

gasite = 0
for interogare in interogari:
    index = cautare_binara(ids, interogare)
    if index == -1:
        print(f"{interogare} -> negasit")
    else:
        print(f"{interogare} -> index {index}")
        gasite += 1
print(f"Gasite: {gasite}")
```
