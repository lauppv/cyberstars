class Tank:
    def __init__(self, capacity):
        self.capacity = capacity
        self.fuel = 0

    def fill(self, amount):
        added = min(amount, self.capacity - self.fuel)
        self.fuel += added
        return added

    def use(self, amount):
        if amount > self.fuel:
            return False
        self.fuel -= amount
        return True

    def percent(self):
        return int(self.fuel / self.capacity * 100)


capacity = 80
actions = ["fill 50", "use 20", "fill 70", "use 100"]
tank = Tank(capacity)
for a in actions:
    k, n = a.split()
    print(f"{a}: {tank.fill(int(n)) if k == 'fill' else tank.use(int(n))}")
print(f"Full: {tank.percent()}%")
