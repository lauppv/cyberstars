```py
from dataclasses import dataclass


@dataclass(order=True)
class Nava:
    viteza: int
    nume: str

    def descrie(self):
        return f"{self.nume} ({self.viteza})"


@dataclass(order=True)
class NavaMarfa(Nava):
    tone: int

    def descrie(self):
        return f"{super().descrie()}, tone {self.tone}"


nave = ["Speranta 12", "Catar 8 300", "Fulger 30", "Bou 8 500"]

flota = []
for linie in nave:
    parti = linie.split()
    if len(parti) == 3:
        flota.append(NavaMarfa(int(parti[1]), parti[0], int(parti[2])))
    else:
        flota.append(Nava(int(parti[1]), parti[0]))

ordonate = sorted(flota, key=lambda n: (n.viteza, n.nume))
for nava in ordonate:
    print(nava.descrie())
print(f"Cea mai rapida: {ordonate[-1].nume}")
print(f"Marfa: {sum(n.tone for n in flota if isinstance(n, NavaMarfa))}")
```
