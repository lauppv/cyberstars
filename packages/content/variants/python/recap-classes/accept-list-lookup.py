class Robot:
    made = 0

    def __init__(self, name):
        self.name = name
        self.battery = 100
        Robot.made = Robot.made + 1

    def work(self, hours):
        need = 10 * hours
        if self.battery >= need:
            self.battery = self.battery - need
            return True
        return False

    def charge(self):
        self.battery = 100

    def __str__(self):
        return self.name + " (" + str(self.battery) + "%)"


names = ["Rex", "Bolt"]
jobs = ["Rex 3", "Bolt 8", "Rex 8"]
crew = [Robot(n) for n in names]
for job in jobs:
    who, h = job.split()
    r = crew[names.index(who)]
    print(job + ": " + ("done" if r.work(int(h)) else "too tired") + " -> " + str(r))
low = [r for r in crew if r.battery < 50]
for r in low:
    r.charge()
print("Charged: " + (", ".join(r.name for r in low) if low else "none"))
print("Robots made: " + str(Robot.made))
