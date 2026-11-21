class Tank:
    def __init__(self, capacity):
        self.capacity = capacity
        self.fuel = 0

    def fill(self, amount):
        self.fuel += amount
        return amount

    def use(self, amount):
        if amount > self.fuel:
            return False
        self.fuel -= amount
        return True

    def percent(self):
        return self.fuel * 100 // self.capacity


capacity = 80
actions = ["fill 50", "use 20", "fill 70", "use 100"]
tank = Tank(capacity)
for a in actions:
    k, n = a.split()
    print(f"{a}: {tank.fill(int(n)) if k == 'fill' else tank.use(int(n))}")
print(f"Full: {tank.percent()}%")
