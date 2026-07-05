```py
n = int(input())
parti = input().split()

# Convertim fiecare parte din string in intreg.
numere = []
i = 0
while i < n:
    numere.append(int(parti[i]))
    i = i + 1

# Presupunem ca primul numar este maximul, apoi comparam cu restul.
# Daca gasim ceva mai mare, actualizam maximul.
maxim = numere[0]
i = 1
while i < n:
    if numere[i] > maxim:
        maxim = numere[i]
    i = i + 1

print(maxim)
```
