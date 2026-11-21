```py
class Persoana:
    def __init__(self, nume, varsta):
        self.nume = nume
        self.varsta = varsta

    def info(self):
        return f"{self.nume}, {self.varsta}"


class Pilot(Persoana):
    def __init__(self, nume, varsta, ore):
        super().__init__(nume, varsta)
        self.ore = ore

    def drumuri_lungi(self):
        return self.ore >= 500


nume = ["Ada", "Ben"]
varste = [36, 29]
ore = [800, 120]

piloti = [Pilot(n, v, o) for n, v, o in zip(nume, varste, ore)]
cei_mai_multe = piloti[0]
for pilot in piloti:
    raspuns = "da" if pilot.drumuri_lungi() else "nu"
    print(f"{pilot.info()} | ore: {pilot.ore} | drumuri lungi: {raspuns}")
    if pilot.ore > cei_mai_multe.ore:
        cei_mai_multe = pilot
print(f"Cele mai multe ore: {cei_mai_multe.info()}")
```
