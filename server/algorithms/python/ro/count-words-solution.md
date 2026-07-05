```py
propozitie = input()

# Un flag ne spune daca suntem in interiorul unui cuvant.
# Cand trecem de la spatiu la litera, incepe un cuvant nou si crestem contorul.
numar_cuvinte = 0
in_cuvant = False

i = 0
while i < len(propozitie):
    caracter = propozitie[i]
    if caracter != " ":
        if not in_cuvant:
            numar_cuvinte = numar_cuvinte + 1
            in_cuvant = True
    else:
        in_cuvant = False
    i = i + 1

print(numar_cuvinte)
```
