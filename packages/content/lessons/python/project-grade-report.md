In this last project we build the report card of the station's school: every student's scores come in one by one, and the program prints a neat table, the grades, and the best student of each subject. It brings together classes, dictionaries, sorting with a key, format specs and `Counter`

---

Each student is an object that keeps a dictionary of scores, one per subject. A score given again for the same subject replaces the old one

```py
class Student:
    def __init__(self, name):
        self.name = name
        self.scores = {}

    def add(self, subject, score):
        self.scores[subject] = score

    def average(self):
        return sum(self.scores.values()) / len(self.scores)

ada = Student("Ada")
ada.add("math", 80)
ada.add("art", 95)
ada.add("math", 90)
print(ada.scores, ada.average())
```

Output

```text
{'math': 90, 'art': 95} 92.5
```

---

The grade comes from the average. Checking from the top down, the first rule that fits wins

```py
def grade(average):
    if average >= 90:
        return "A"
    if average >= 80:
        return "B"
    if average >= 70:
        return "C"
    if average >= 60:
        return "D"
    return "F"

print(grade(92.5), grade(79.9), grade(12))
```

Output

```text
A C F
```

---

Students arrive in any order, so a dictionary from names to objects finds each one quickly. A name seen for the first time makes a new `Student`

```py
class Student:
    def __init__(self, name):
        self.name = name
        self.scores = {}

students = {}
for name in ["Ada", "Ben", "Ada"]:
    if name not in students:
        students[name] = Student(name)
print(list(students))
```

Output

```text
['Ada', 'Ben']
```

---

The table is sorted by average, the best first. A minus in front of a number in the key turns its order around, so the names can still go from A to Z on a tie. Format specs make the columns line up

```py
rows = [("Ben", 81.25), ("Ada", 92.5), ("Cy", 81.25)]
for name, avg in sorted(rows, key=lambda r: (-r[1], r[0])):
    print(f"{name:<6}{avg:>6.1f}")
```

Output

```text
Ada     92.5
Ben     81.2
Cy      81.2
```

`81.25` shows as `81.2`: Python rounds a number exactly halfway to the even digit, as long as the number is stored exactly, and 81.25 is

---

## Mission: Report Card

Write the report card and print it for the scores typed in

1. Write a class **Student** with `__init__(name)`, a method **add(subject, score)**, a method **average()** and a method **grade()** that returns the letter for the average, as above
2. Read lines until one that says `end`. Each line is a student's name, a subject and a whole score, like `Ada math 92`
3. Print a line for each student, from the best average to the worst, on a tie in name order: the name in a column 8 characters wide on the left, the average with 1 decimal in a column 6 wide on the right, two spaces and the grade
4. Print `Grades: ` and, for each grade from A to F that some student got, the letter, a space and how many students got it, joined with `, `. Count them with `Counter`
5. For each subject, in name order, print `Top in `, the subject, `: ` and the student with the best score in it, on a tie the first in name order

Names and subjects are one word. Scores are from 0 to 100, and there are from 1 to 30 lines before `end`

**Input**

```text
Ada math 92
Ben math 75
Ada art 88
Cy art 95
Ben art 88
Ada math 70
end
```

**Output**

```text
Cy        95.0  A
Ben       81.5  B
Ada       79.0  C
Grades: A 1, B 1, C 1
Top in art: Cy
Top in math: Ben
```

Ada's second math score, 70, replaces her 92, so Ben is top in math
