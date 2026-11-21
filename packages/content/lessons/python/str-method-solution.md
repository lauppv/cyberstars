```py
class Planet:
    def __init__(self, name, moons, rings):
        self.name = name
        self.moons = moons
        self.rings = rings

    def __str__(self):
        if self.moons == 0:
            text = f"{self.name}, no moons"
        else:
            text = f"{self.name}, moons: {self.moons}"
        if self.rings:
            text += ", rings"
        return text


names = ["Saturn", "Mars", "Venus"]
moons = [146, 2, 0]
rings = [True, False, False]

planets = [Planet(n, m, r) for n, m, r in zip(names, moons, rings)]
for planet in planets:
    print(planet)

ringed = [str(p) for p in planets if p.rings]
if len(ringed) == 0:
    print("With rings: none")
else:
    print(f"With rings: {' / '.join(ringed)}")
```
