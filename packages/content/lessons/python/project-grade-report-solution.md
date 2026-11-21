```py
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
        average = self.average()
        if average >= 90:
            return "A"
        if average >= 80:
            return "B"
        if average >= 70:
            return "C"
        if average >= 60:
            return "D"
        return "F"


students = {}
while True:
    line = input()
    if line == "end":
        break
    name, subject, score = line.split()
    if name not in students:
        students[name] = Student(name)
    students[name].add(subject, int(score))

ranked = sorted(students.values(), key=lambda s: (-s.average(), s.name))
for student in ranked:
    print(f"{student.name:<8}{student.average():>6.1f}  {student.grade()}")

grades = Counter(student.grade() for student in ranked)
print("Grades: " + ", ".join(f"{letter} {grades[letter]}" for letter in "ABCDF" if grades[letter] > 0))

subjects = sorted({subject for student in ranked for subject in student.scores})
for subject in subjects:
    takers = [s for s in students.values() if subject in s.scores]
    best = sorted(takers, key=lambda s: (-s.scores[subject], s.name))[0]
    print(f"Top in {subject}: {best.name}")
```
