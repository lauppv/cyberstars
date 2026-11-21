from collections import Counter


class Student:
    def __init__(self, name):
        self.name = name
        self.scores = {}

    def add(self, subject, score):
        self.scores[subject] = score

    def average(self):
        return sum(self.scores.values()) / len(self.scores)

    def grade(self):
        a = self.average()
        return "A" if a > 90 else "B" if a > 80 else "C" if a > 70 else "D" if a > 60 else "F"


students = {}
while (line := input()) != "end":
    n, sub, sc = line.split()
    students.setdefault(n, Student(n)).add(sub, int(sc))
order = sorted(students.values(), key=lambda s: (-s.average(), s.name))
for s in order:
    print(f"{s.name:<8}{s.average():>6.1f}  {s.grade()}")
c = Counter(s.grade() for s in order)
print("Grades: " + ", ".join(f"{k} {c[k]}" for k in "ABCDF" if c[k]))
for sub in sorted({x for s in order for x in s.scores}):
    print(f"Top in {sub}: {sorted([s for s in order if sub in s.scores], key=lambda s: (-s.scores[sub], s.name))[0].name}")
