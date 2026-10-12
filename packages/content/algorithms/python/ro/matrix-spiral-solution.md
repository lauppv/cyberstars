```py
n = int(input())

# Citim n randuri, fiecare cu n numere.
matrice = []
i = 0
while i < n:
    parti = input().split()
    rand = []
    j = 0
    while j < n:
        rand.append(int(parti[j]))
        j = j + 1
    matrice.append(rand)
    i = i + 1

# Tinem patru margini: sus, jos, stanga, dreapta. In fiecare iteratie
# parcurgem stratul curent in 4 directii, apoi restrangem marginile spre interior.
sus = 0
jos = n - 1
stanga = 0
dreapta = n - 1

rezultat = []

while sus <= jos and stanga <= dreapta:
    # Randul de sus: stanga -> dreapta.
    col = stanga
    while col <= dreapta:
        rezultat.append(matrice[sus][col])
        col = col + 1
    sus = sus + 1

    # Coloana din dreapta: sus -> jos.
    rand = sus
    while rand <= jos:
        rezultat.append(matrice[rand][dreapta])
        rand = rand + 1
    dreapta = dreapta - 1

    # Randul de jos: dreapta -> stanga. Doar daca mai avem randuri.
    if sus <= jos:
        col = dreapta
        while col >= stanga:
            rezultat.append(matrice[jos][col])
            col = col - 1
        jos = jos - 1

    # Coloana din stanga: jos -> sus. Doar daca mai avem coloane.
    if stanga <= dreapta:
        rand = jos
        while rand >= sus:
            rezultat.append(matrice[rand][stanga])
            rand = rand - 1
        stanga = stanga + 1

# Construim output-ul manual, separat prin spatii.
out = ""
i = 0
while i < len(rezultat):
    out = out + str(rezultat[i])
    if i < len(rezultat) - 1:
        out = out + " "
    i = i + 1

print(out)
```
