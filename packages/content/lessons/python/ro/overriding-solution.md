```py
class Alarma:
    def __init__(self, loc):
        self.loc = loc

    def mesaj(self):
        return f"Alarma in {self.loc}"


class AlarmaIncendiu(Alarma):
    def mesaj(self):
        return super().mesaj() + ": incendiu, iesiti acum"


class AlarmaUsa(Alarma):
    def mesaj(self):
        return f"Usa deschisa in {self.loc}"


locuri = ["Doc", "Laborator", "Sala de sport"]
feluri = ["simpla", "incendiu", "usa"]

clase = {"simpla": Alarma, "incendiu": AlarmaIncendiu, "usa": AlarmaUsa}
alarme = [clase[fel](loc) for loc, fel in zip(locuri, feluri)]
for alarma in alarme:
    print(alarma.mesaj())
print(f"Alarme de incendiu: {feluri.count('incendiu')}")
```
