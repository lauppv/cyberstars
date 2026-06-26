```py
numar_secret = 42
ghiciri = [50, 30, 40, 45, 42]

def verifica_ghicirea(numar_secret, ghicire):
    if ghicire < numar_secret:
        return "prea mic"
    elif ghicire > numar_secret:
        return "prea mare"
    else:
        return "corect"

incercari = 0
for ghicire in ghiciri:
    incercari += 1
    rezultat = verifica_ghicirea(numar_secret, ghicire)
    print(f"{ghicire}: {rezultat}")
    if rezultat == "corect":
        print(f"Spart in {incercari} incercari!")
        break
```
