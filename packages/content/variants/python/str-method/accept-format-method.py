class Planet:
    def __init__(self, name, moons, rings=False):
        self.name = name
        self.moons = moons
        self.rings = rings

    def __str__(self):
        moon_text = "moons: {}".format(self.moons) if self.moons > 0 else "no moons"
        ring_text = ", rings" if self.rings else ""
        return "{}, {}{}".format(self.name, moon_text, ring_text)


names = ["Saturn", "Mars", "Venus"]
moons = [146, 2, 0]
rings = [True, False, False]
ringed = []
for n, m, r in zip(names, moons, rings):
    p = Planet(n, m, rings=r)
    print(p)
    if p.rings:
        ringed.append(str(p))
print("With rings:", " / ".join(ringed) if ringed else "none")
