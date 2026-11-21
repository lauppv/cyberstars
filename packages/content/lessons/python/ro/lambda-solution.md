```py
def schimba_tot(preturi, regula):
    schimbate = []
    for pret in preturi:
        schimbate.append(regula(pret))
    return schimbate


preturi = [23, 40, 7]
taxa = 5

print(f"Jumatate de pret: {schimba_tot(preturi, lambda p: p // 2)}")
print(f"Cu taxa: {schimba_tot(preturi, lambda p: p + taxa)}")
print(f"Rotunjite: {schimba_tot(preturi, lambda p: (p + 9) // 10 * 10)}")
print(f"Initiale: {preturi}")
```
