class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def info(self):
        return self.name + ", " + str(self.age)


class Pilot(Person):
    def __init__(self, name, age, hours):
        super(Pilot, self).__init__(name, age)
        self.hours = hours

    def long_trips(self):
        return not self.hours < 500


names = ["Ada", "Ben"]
ages = [36, 29]
hours = [800, 120]
crew = []
for i in range(len(names)):
    crew.append(Pilot(names[i], ages[i], hours[i]))
for p in crew:
    print(p.info() + " | hours: " + str(p.hours) + " | long trips: " + ("yes" if p.long_trips() else "no"))
top = max(crew, key=lambda p: p.hours)
print("Most hours: " + top.info())
