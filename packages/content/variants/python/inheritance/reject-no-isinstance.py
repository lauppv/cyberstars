class Module:
    def __init__(self, name, power):
        self.name = name
        self.power = power

    def report(self):
        return f"{self.name} uses {self.power} kW"


class SolarPanel(Module):
    def energy(self, hours):
        return self.power * hours


names = ["Dock", "Panel A"]
powers = [40, 5]
solar = [False, True]
hours = 6

modules = []
for name, power, is_solar in zip(names, powers, solar):
    if is_solar:
        modules.append(SolarPanel(name, power))
    else:
        modules.append(Module(name, power))

panels = 0
for module in modules:
    if type(module) == SolarPanel:
        panels += 1
        print(f"{module.report()}, makes {module.energy(hours)} kWh")
    else:
        print(module.report())
print(f"Panels: {panels}")
