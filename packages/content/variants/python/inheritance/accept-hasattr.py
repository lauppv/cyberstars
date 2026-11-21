class Module:
    def __init__(self, name, power):
        self.name, self.power = name, power

    def report(self):
        return self.name + " uses " + str(self.power) + " kW"


class SolarPanel(Module):
    def energy(self, hours):
        return hours * self.power


names = ["Dock", "Panel A"]
powers = [40, 5]
solar = [False, True]
hours = 6
kinds = {True: SolarPanel, False: Module}
items = [kinds[s](n, p) for n, p, s in zip(names, powers, solar)]
for m in items:
    line = m.report()
    if hasattr(m, "energy"):
        line += ", makes " + str(m.energy(hours)) + " kWh"
    print(line)
print("Panels:", sum(1 for m in items if isinstance(m, SolarPanel)))
