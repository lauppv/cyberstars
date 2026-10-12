```py
propozitie = input()
cuvinte = propozitie.split()

for cuvant in cuvinte:
    numar = 0
    for litera in cuvant:
        if litera == 'a' or litera == 'e' or litera == 'i' or litera == 'o' or litera == 'u':
            numar = numar + 1
        elif litera == 'A' or litera == 'E' or litera == 'I' or litera == 'O' or litera == 'U':
            numar = numar + 1
    if numar == 2:
        print(cuvant)
```
