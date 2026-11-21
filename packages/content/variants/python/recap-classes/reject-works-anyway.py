class Robot:
    made = 0

    def __init__(self, name):
        self.name = name
        self.battery = 100
        Robot.made += 1

    def work(self, hours):
        self.battery = max(0, self.battery - hours * 10)
        return self.battery > 0

    def charge(self):
        self.battery = 100

    def __str__(self):
        return f"{self.name} ({self.battery}%)"


names = ["Rex", "Bolt"]
jobs = ["Rex 3", "Bolt 8", "Rex 8"]
robots = {n: Robot(n) for n in names}
for job in jobs:
    n, h = job.split()
    print(f"{job}: {'done' if robots[n].work(int(h)) else 'too tired'} -> {robots[n]}")
charged = [n for n in names if robots[n].battery < 50]
for n in charged:
    robots[n].charge()
print(f"Charged: {', '.join(charged) or 'none'}")
print(f"Robots made: {Robot.made}")
