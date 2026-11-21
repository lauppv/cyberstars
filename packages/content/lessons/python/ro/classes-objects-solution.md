```py
class Nava:
    pass


nume = ["Speranta", "Fulger", "Bob"]
viteze = [12, 30, 5]

flota = []
for n, viteza in zip(nume, viteze):
    nava = Nava()
    nava.nume = n
    nava.viteza = viteza
    flota.append(nava)

cea_mai_rapida = flota[0]
for nava in flota:
    print(f"{nava.nume}: {nava.viteza}")
    if nava.viteza > cea_mai_rapida.viteza:
        cea_mai_rapida = nava
print(f"Cea mai rapida: {cea_mai_rapida.nume}")
```
