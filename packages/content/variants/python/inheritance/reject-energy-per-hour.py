class Module:
    def __init__(self, name, power):
        self.name, self.power = name, power

    def report(self):
        return f"{self.name} uses {self.power} kW"


class SolarPanel(Module):
    def energy(self, hours):
        return self.power


names = ["Dock", "Panel A"]
powers = [40, 5]
solar = [False, True]
hours = 6
mods = [SolarPanel(n, p) if s else Module(n, p) for n, p, s in zip(names, powers, solar)]
for m in mods:
    print(m.report() + (f", makes {m.energy(hours)} kWh" if isinstance(m, SolarPanel) else ""))
print(f"Panels: {sum(isinstance(m, SolarPanel) for m in mods)}")
