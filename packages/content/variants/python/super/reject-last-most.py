class Person:
    def __init__(self, name, age):
        self.name, self.age = name, age

    def info(self):
        return f"{self.name}, {self.age}"


class Pilot(Person):
    def __init__(self, name, age, hours):
        super().__init__(name, age)
        self.hours = hours

    def long_trips(self):
        return self.hours >= 500


names = ["Ada", "Ben"]
ages = [36, 29]
hours = [800, 120]
pilots = [Pilot(*t) for t in zip(names, ages, hours)]
most = pilots[0]
for p in pilots:
    print(f"{p.info()} | hours: {p.hours} | long trips: {'yes' if p.long_trips() else 'no'}")
    if p.hours >= most.hours:
        most = p
print(f"Most hours: {most.info()}")
