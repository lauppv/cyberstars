```py
n = int(input())
parti = input().split()

numere = []
i = 0
while i < n:
    numere.append(int(parti[i]))
    i = i + 1

# La pasul i, primele i elemente sunt deja sortate.
# Luam elementul de pe pozitia i si il "inseram" in ordine
# mutand la dreapta orice element mai mare decat el.
i = 1
while i < n:
    curent = numere[i]

    j = i - 1
    while j >= 0 and numere[j] > curent:
        numere[j + 1] = numere[j]
        j = j - 1

    numere[j + 1] = curent
    i = i + 1

# Construim output-ul manual, separat prin spatii.
out = ""
i = 0
while i < n:
    out = out + str(numere[i])
    if i < n - 1:
        out = out + " "
    i = i + 1

print(out)
```
