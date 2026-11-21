```py
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

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

pilots = [Pilot(n, a, h) for n, a, h in zip(names, ages, hours)]
most = pilots[0]
for pilot in pilots:
    answer = "yes" if pilot.long_trips() else "no"
    print(f"{pilot.info()} | hours: {pilot.hours} | long trips: {answer}")
    if pilot.hours > most.hours:
        most = pilot
print(f"Most hours: {most.info()}")
```
