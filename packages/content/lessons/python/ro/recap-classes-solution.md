```py
class Robot:
    facuti = 0

    def __init__(self, nume):
        self.nume = nume
        self.baterie = 100
        Robot.facuti += 1

    def lucreaza(self, ore):
        if ore * 10 > self.baterie:
            return False
        self.baterie -= ore * 10
        return True

    def incarca(self):
        self.baterie = 100

    def __str__(self):
        return f"{self.nume} ({self.baterie}%)"


nume = ["Rex", "Bolt"]
sarcini = ["Rex 3", "Bolt 8", "Rex 8"]

roboti = {n: Robot(n) for n in nume}
for sarcina in sarcini:
    n, ore = sarcina.split()
    robot = roboti[n]
    rezultat = "gata" if robot.lucreaza(int(ore)) else "prea obosit"
    print(f"{sarcina}: {rezultat} -> {robot}")

incarcati = []
for n in nume:
    if roboti[n].baterie < 50:
        roboti[n].incarca()
        incarcati.append(n)
print(f"Incarcati: {', '.join(incarcati) if incarcati else 'niciunul'}")
print(f"Roboti facuti: {Robot.facuti}")
```
