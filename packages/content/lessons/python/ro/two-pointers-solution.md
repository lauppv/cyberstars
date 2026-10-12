```py
combustibili = [1, 2, 3, 4, 5, 6, 7, 8, 9]
tinta = 10

def pereche_cu_suma(numere, tinta):
    perechi = []
    stanga = 0
    dreapta = len(numere) - 1
    while stanga < dreapta:
        suma_curenta = numere[stanga] + numere[dreapta]
        if suma_curenta == tinta:
            perechi.append((numere[stanga], numere[dreapta]))
            stanga += 1
            dreapta -= 1
        elif suma_curenta < tinta:
            stanga += 1
        else:
            dreapta -= 1
    return perechi

rezultat = pereche_cu_suma(combustibili, tinta)
print(f"Perechi: {rezultat}")
print(f"Total perechi: {len(rezultat)}")
```
