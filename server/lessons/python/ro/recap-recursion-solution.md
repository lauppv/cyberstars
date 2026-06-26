```py
sector = [
    [0, 1, 0, 0, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0],
    [1, 1, 0, 0, 0],
    [0, 0, 0, 1, 2],
]

def numara_balize(sector):
    total = 0
    for rand in sector:
        for celula in rand:
            if celula == 2:
                total += 1
    return total

def aplatizeaza_sortat(sector):
    valori = []
    for rand in sector:
        for celula in rand:
            if celula not in valori:
                valori.append(celula)
    return sorted(valori)

def gaseste_valoare(lista_sortata, tinta):
    if len(lista_sortata) == 0:
        return False
    mijloc = len(lista_sortata) // 2
    if lista_sortata[mijloc] == tinta:
        return True
    elif lista_sortata[mijloc] < tinta:
        return gaseste_valoare(lista_sortata[mijloc + 1:], tinta)
    else:
        return gaseste_valoare(lista_sortata[:mijloc], tinta)

print(f"Faruri: {numara_balize(sector)}")
plat = aplatizeaza_sortat(sector)
print(f"Valori unice: {plat}")
print(f"Are valoare far: {gaseste_valoare(plat, 2)}")
print(f"Are valoarea 3: {gaseste_valoare(plat, 3)}")
```
