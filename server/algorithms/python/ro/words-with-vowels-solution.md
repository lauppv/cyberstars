```py
propozitie = input()
vocale = set('aeiouAEIOU')

for cuvant in propozitie.split():
    numar = sum(1 for litera in cuvant if litera in vocale)
    if numar == 2:
        print(cuvant)
```
