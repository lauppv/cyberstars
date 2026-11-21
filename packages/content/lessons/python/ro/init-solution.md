```py
class Membru:
    def __init__(self, nume, rol):
        self.nume = nume
        self.rol = rol
        self.cod = f"{nume[:3].upper()}-{len(rol)}"


nume = ["Ada", "Alan", "Grace"]
roluri = ["pilot", "medic", "inginer"]

for n, rol in zip(nume, roluri):
    membru = Membru(n, rol)
    print(f"{membru.cod} {membru.nume} ({membru.rol})")
```
