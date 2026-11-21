class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def info(self):
        return f"{self.name}, {self.age}"


class Pilot(Person):
    def __init__(self, name, age, hours):
        self.name = name
        self.age = age
        self.hours = hours

    def long_trips(self):
        return self.hours >= 500


names = ["Ada", "Ben"]
ages = [36, 29]
hours = [800, 120]
pilots = [Pilot(*t) for t in zip(names, ages, hours)]
for p in pilots:
    print(f"{p.info()} | hours: {p.hours} | long trips: {'yes' if p.long_trips() else 'no'}")
print(f"Most hours: {max(pilots, key=lambda p: p.hours).info()}")
