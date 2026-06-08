sector = [
[0, 1, 0, 0, 0],
[0, 1, 0, 1, 0],
[0, 0, 0, 1, 0],
[1, 1, 0, 0, 0],
[0, 0, 0, 1, 2],
]

def numara_balize(sector): # bucle imbricate: numără câte celule sunt egale cu 2
    pass

def aplatizeaza_sortat(sector): # restrânge grila într-o listă sortată cu valori unice
    pass

def gaseste_valoare(lista_sortata, tinta): # căutare binară recursivă: întoarce True dacă tinta e în listă, altfel False
    pass

print(f"Faruri: {numara_balize(sector)}")
plat = aplatizeaza_sortat(sector)
print(f"Valori unice: {plat}")
print(f"Are valoare far: {gaseste_valoare(plat, 2)}")
print(f"Are valoarea 3: {gaseste_valoare(plat, 3)}")
