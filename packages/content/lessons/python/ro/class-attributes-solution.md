```py
class Nava:
    urmatorul_numar = 1
    flota = "Flota Libera"

    def __init__(self, nume):
        self.nume = nume
        self.numar = Nava.urmatorul_numar
        Nava.urmatorul_numar += 1


nume = ["Speranta", "Fulger"]
flota = "Flota Stelara"

nave = [Nava(n) for n in nume]
Nava.flota = flota
for nava in nave:
    print(f"#{nava.numar} {nava.nume} din {nava.flota}")
print(f"Urmatorul numar liber: {Nava.urmatorul_numar}")
```
