```py
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
        return self.fuel * 100 // self.capacity


capacity = 80
actions = ["fill 50", "use 20", "fill 70", "use 100"]

tank = Tank(capacity)
for action in actions:
    name, amount = action.split()
    if name == "fill":
        result = tank.fill(int(amount))
    else:
        result = tank.use(int(amount))
    print(f"{action}: {result}")
print(f"Full: {tank.percent()}%")
```
