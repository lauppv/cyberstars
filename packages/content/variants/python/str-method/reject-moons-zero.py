class Planet:
    def __init__(self, name, moons, rings):
        self.name, self.moons, self.rings = name, moons, rings

    def __str__(self):
        return f"{self.name}, moons: {self.moons}" + (", rings" if self.rings else "")


names = ["Saturn", "Mars", "Venus"]
moons = [146, 2, 0]
rings = [True, False, False]
planets = [Planet(*t) for t in zip(names, moons, rings)]
for p in planets:
    print(p)
r = [str(p) for p in planets if p.rings]
print("With rings: " + (" / ".join(r) or "none"))
