class Planet:
    def __init__(self, name, moons, rings):
        self.name, self.moons, self.rings = name, moons, rings

    def card(self):
        text = f"{self.name}, no moons" if self.moons == 0 else f"{self.name}, moons: {self.moons}"
        return text + (", rings" if self.rings else "")


names = ["Saturn", "Mars", "Venus"]
moons = [146, 2, 0]
rings = [True, False, False]
planets = [Planet(*t) for t in zip(names, moons, rings)]
for p in planets:
    print(p.card())
r = [p.card() for p in planets if p.rings]
print("With rings: " + (" / ".join(r) or "none"))
