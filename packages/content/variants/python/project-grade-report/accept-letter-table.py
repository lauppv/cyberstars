from collections import Counter


class Student:
    LIMITS = [(90, "A"), (80, "B"), (70, "C"), (60, "D")]

    def __init__(self, name):
        self.name = name
        self.scores = {}

    def add(self, subject, score):
        self.scores[subject] = score

    def average(self):
        return sum(self.scores.values()) / len(self.scores)

    def grade(self):
        for limit, letter in Student.LIMITS:
            if self.average() >= limit:
                return letter
        return "F"


students = {}
line = input()
while line != "end":
    n, sub, sc = line.split()
    students.setdefault(n, Student(n)).add(sub, int(sc))
    line = input()
order = sorted(students.values(), key=lambda s: (-s.average(), s.name))
for s in order:
    print("{:<8}{:>6.1f}  {}".format(s.name, s.average(), s.grade()))
count = Counter([s.grade() for s in order])
print("Grades:", ", ".join(k + " " + str(count[k]) for k in "ABCDF" if k in count))
all_subjects = set()
for s in order:
    all_subjects.update(s.scores)
for sub in sorted(all_subjects):
    best = min((s for s in order if sub in s.scores), key=lambda s: (-s.scores[sub], s.name))
    print(f"Top in {sub}: {best.name}")
