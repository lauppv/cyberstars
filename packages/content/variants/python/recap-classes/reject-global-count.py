made = 0


class Robot:
    def __init__(self, name):
        self.name = name
        self.battery = 100
        global made
        made += 1

    def work(self, hours):
        if hours * 10 > self.battery:
            return False
        self.battery -= hours * 10
        return True

    def charge(self):
        self.battery = 100

    def __str__(self):
        return f"{self.name} ({self.battery}%)"


names = ["Rex", "Bolt"]
jobs = ["Rex 3", "Bolt 8", "Rex 8"]

robots = {name: Robot(name) for name in names}
for job in jobs:
    name, hours = job.split()
    robot = robots[name]
    result = "done" if robot.work(int(hours)) else "too tired"
    print(f"{job}: {result} -> {robot}")

charged = []
for name in names:
    if robots[name].battery < 50:
        robots[name].charge()
        charged.append(name)
print(f"Charged: {', '.join(charged) if charged else 'none'}")
print(f"Robots made: {made}")
