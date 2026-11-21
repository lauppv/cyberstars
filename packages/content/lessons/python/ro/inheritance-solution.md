```py
class Modul:
    def __init__(self, nume, putere):
        self.nume = nume
        self.putere = putere

    def raport(self):
        return f"{self.nume} foloseste {self.putere} kW"


class PanouSolar(Modul):
    def energie(self, ore):
        return self.putere * ore


nume = ["Doc", "Panoul A"]
puteri = [40, 5]
solar = [False, True]
ore = 6

module = []
for n, putere, e_solar in zip(nume, puteri, solar):
    if e_solar:
        module.append(PanouSolar(n, putere))
    else:
        module.append(Modul(n, putere))

panouri = 0
for modul in module:
    if isinstance(modul, PanouSolar):
        panouri += 1
        print(f"{modul.raport()}, face {modul.energie(ore)} kWh")
    else:
        print(modul.raport())
print(f"Panouri: {panouri}")
```
