class Planet:
    def __init__(self, name, moons, rings):
        self.name, self.moons, self.rings = name, moons, rings

    def __str__(self):
        parts = [self.name, "no moons" if not self.moons else "moons: " + str(self.moons)]
        if self.rings:
            parts.append("rings")
        return ", ".join(parts)


names = ["Saturn", "Mars", "Venus"]
moons = [146, 2, 0]
rings = [True, False, False]
planets = []
for i in range(len(names)):
    planets.append(Planet(names[i], moons[i], rings[i]))
    print(planets[-1])
cards = [f"{p}" for p in planets if p.rings]
print("With rings: " + (" / ".join(cards) if cards else "none"))
