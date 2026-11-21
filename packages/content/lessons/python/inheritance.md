Some kinds of things are special cases of others. A solar panel is a station module with something extra: it makes power from sunlight. Instead of writing the same class twice, a class can **inherit** from another one, take everything it has, and add its own

---

Put the parent class in brackets after the new class's name. The new class, the child, gets all the parent's methods

```py
class Module:
    def __init__(self, name):
        self.name = name

    def report(self):
        return f"{self.name} is online"

class SolarPanel(Module):
    pass

panel = SolarPanel("Panel A")
print(panel.report())
```

Output

```text
Panel A is online
```

`SolarPanel` has no `__init__` or `report` of its own, so Python takes the parent's. That's why `SolarPanel("Panel A")` needs a name, like a `Module` does

---

The child can add methods the parent doesn't have. A plain module doesn't have them, a solar panel does

```py
class Module:
    def __init__(self, name):
        self.name = name

    def report(self):
        return f"{self.name} is online"

class SolarPanel(Module):
    def energy(self, hours):
        return hours * 5

panel = SolarPanel("Panel A")
dock = Module("Dock")
print(panel.report(), panel.energy(4))
print(dock.report())
print(hasattr(dock, "energy"))
```

Output

```text
Panel A is online 20
Dock is online
False
```

`hasattr()` asks if an object has an attribute or a method with that name

---

`isinstance(obj, Class)` tells us what kind of object we have. A child counts as its parent too: every solar panel is a module, but not every module is a solar panel

```py
class Module:
    pass

class SolarPanel(Module):
    pass

panel = SolarPanel()
dock = Module()
print(isinstance(panel, SolarPanel), isinstance(panel, Module))
print(isinstance(dock, SolarPanel))
```

Output

```text
True True
False
```

So a list of modules can hold both kinds, and the program can treat each one by what it is

---

## Mission: Power Check

The station has many modules, and some of them are solar panels. Every module can report, and solar panels can also say how much energy they make

1. Write a class **Module** with an `__init__` that takes a `name` and a `power` (the kilowatts it uses), and a method **report()** that returns `name uses power kW`
2. Write a class **SolarPanel** that inherits from `Module` and adds a method **energy(hours)** that returns the power times the hours
3. Start your program with four variables: **names**, a list of strings, **powers**, a list of whole numbers, and **solar**, a list of True or False, all in the same order, and **hours**, a whole number. For example `names = ["Dock", "Panel A"]`, `powers = [40, 5]`, `solar = [False, True]` and `hours = 6`
4. Make a `SolarPanel` where solar is True and a `Module` where it's False. For each, print its report. For a solar panel, add `, makes ` its energy for the hours and ` kWh`
5. Print `Panels: ` and how many of the modules are solar panels, found with `isinstance()`

The lists have from 1 to 10 modules. Powers are from 1 to 100, and hours from 0 to 24

**Example** for the values above

```text
Dock uses 40 kW
Panel A uses 5 kW, makes 30 kWh
Panels: 1
```
