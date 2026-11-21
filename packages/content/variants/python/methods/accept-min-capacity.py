class Tank:
    def __init__(self, capacity):
        self.capacity = capacity
        self.fuel = 0

    def fill(self, amount):
        before = self.fuel
        self.fuel = min(self.capacity, self.fuel + amount)
        return self.fuel - before

    def use(self, amount):
        if self.fuel - amount < 0:
            return False
        self.fuel -= amount
        return True

    def percent(self):
        return (100 * self.fuel) // self.capacity


capacity = 80
actions = ["fill 50", "use 20", "fill 70", "use 100"]
tank = Tank(capacity)
for a in actions:
    kind, n = a.split()
    print(f"{a}: {tank.fill(int(n)) if kind == 'fill' else tank.use(int(n))}")
print(f"Full: {tank.percent()}%")
