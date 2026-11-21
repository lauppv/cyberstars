```py
from dataclasses import dataclass


@dataclass(order=True)
class Lada:
    greutate: int
    eticheta: str


greutati = [40, 5, 40]
etichete = ["mancare", "seminte", "carti"]

lazi = [Lada(g, e) for g, e in zip(greutati, etichete)]
ordonate = sorted(lazi)
for lada in ordonate:
    print(lada)
print(f"Cea mai grea: {ordonate[-1].eticheta}")
print(f"La fel ca prima: {lazi.count(lazi[0])}")
```
