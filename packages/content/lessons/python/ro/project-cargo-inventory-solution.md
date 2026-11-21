```py
import json


class EroareInventar(Exception):
    pass


class Inventar:
    def __init__(self):
        self.produse = {}

    def adauga(self, nume, bucati, kg):
        if nume in self.produse:
            self.produse[nume]["bucati"] += bucati
        else:
            self.produse[nume] = {"bucati": bucati, "kg": kg}

    def scoate(self, nume, bucati):
        if nume not in self.produse:
            raise EroareInventar("nu exista produsul")
        ramase = self.produse[nume]["bucati"]
        if bucati > ramase:
            raise EroareInventar(f"au ramas doar {ramase}")
        self.produse[nume]["bucati"] -= bucati

    def salveaza(self, cale):
        with open(cale, "w") as f:
            json.dump(self.produse, f)


def incarca_inventar(cale):
    cala = Inventar()
    with open(cale) as f:
        cala.produse = json.load(f)
    return cala


cala = Inventar()
while True:
    linie = input()
    if linie == "end":
        break
    parti = linie.split()
    if parti[0] == "adauga":
        cala.adauga(parti[1], int(parti[2]), int(parti[3]))
    else:
        try:
            cala.scoate(parti[1], int(parti[2]))
        except EroareInventar as e:
            print(f"{linie}: {e}")

cala.salveaza("cargo.json")
incarcata = incarca_inventar("cargo.json")

total = 0
cel_mai_greu = "niciunul"
maxim = 0
for nume in sorted(incarcata.produse):
    bucati = incarcata.produse[nume]["bucati"]
    kg = incarcata.produse[nume]["kg"]
    if bucati == 0:
        continue
    greutate = bucati * kg
    total += greutate
    print(f"{nume}: {bucati} x {kg} kg = {greutate} kg")
    if greutate > maxim:
        cel_mai_greu = nume
        maxim = greutate
print(f"Total: {total} kg")
print(f"Cel mai greu: {cel_mai_greu}")
```
