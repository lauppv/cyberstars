class Tank:
    def __init__(self, capacity):
        self.capacity = capacity
        self.fuel = 0

    def fill(self, amount):
        room = self.capacity - self.fuel
        if amount > room:
            amount = room
        self.fuel = self.fuel + amount
        return amount

    def use(self, amount):
        ok = self.fuel >= amount
        if ok:
            self.fuel = self.fuel - amount
        return ok

    def percent(self):
        return int(self.fuel * 100 / self.capacity)


capacity = 80
actions = ["fill 50", "use 20", "fill 70", "use 100"]
t = Tank(capacity)
for a in actions:
    word, number = a.split(" ")
    method = t.fill if word == "fill" else t.use
    print(a + ": " + str(method(int(number))))
print("Full: " + str(t.percent()) + "%")
