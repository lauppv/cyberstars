```py
n = int(input())
parti = input().split()

numere = []
i = 0
while i < n:
    numere.append(int(parti[i]))
    i = i + 1

# Pentru fiecare numar, verificam liniar daca l-am mai pus in rezultat.
# Daca nu, il adaugam; daca da, il sarim.
rezultat = []
i = 0
while i < n:
    numar = numere[i]

    deja_vazut = False
    j = 0
    while j < len(rezultat):
        if rezultat[j] == numar:
            deja_vazut = True
            break
        j = j + 1

    if not deja_vazut:
        rezultat.append(numar)

    i = i + 1

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
