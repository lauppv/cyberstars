```py
propozitie = input()
cuvinte = propozitie.split()

rezultat = ""
i = len(cuvinte) - 1
while i >= 0:
    rezultat = rezultat + cuvinte[i]
    if i > 0:
        rezultat = rezultat + " "
    i = i - 1

print(rezultat)
```
