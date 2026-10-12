```py
propozitie = input()
cuvinte = propozitie.split()

cel_mai_lung = cuvinte[0]
for cuvant in cuvinte[1:]:
    if len(cuvant) > len(cel_mai_lung):
        cel_mai_lung = cuvant

print(cel_mai_lung)
```
