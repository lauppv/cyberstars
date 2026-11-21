```py
def alege(oameni, **potrivire):
    alesi = []
    for om in oameni:
        pastreaza = True
        for cheie, valoare in potrivire.items():
            if om[cheie] != valoare:
                pastreaza = False
        if pastreaza:
            alesi.append(om)
    return alesi


echipaj = [
    {"nume": "Ada", "rol": "pilot", "varsta": 36},
    {"nume": "Ben", "rol": "medic", "varsta": 52},
    {"nume": "Cy", "rol": "pilot", "varsta": 52},
]
rol = "pilot"

in_varsta = sorted(echipaj, key=lambda o: (-o["varsta"], o["nume"]))
print(f"Cei mai in varsta: {', '.join([o['nume'] for o in in_varsta])}")

gasiti = sorted([o["nume"] for o in alege(echipaj, rol=rol)])
if len(gasiti) == 0:
    print(f"Rol: {rol}: nimeni")
else:
    print(f"Rol: {rol}: {', '.join(gasiti)}")

print(f"Varste: {' '.join(map(lambda o: str(o['varsta']), echipaj))}")
```
