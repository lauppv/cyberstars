Last project — let's build a **student gradebook**! This one combines **classes**, **HashMap**, and **ArrayList** into a real-world application. Think of it like the stats screen in Vice City, but for school instead of crime

---

**First, a quick HashMap refresher**

A HashMap stores **key-value pairs**. Perfect for mapping a subject name to a grade

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> grades = new HashMap<>();
        grades.put("Math", 92);
        grades.put("English", 85);
        grades.put("Science", 78);

        System.out.println("Math: " + grades.get("Math"));
    }
}
```

Output

```text
Math: 92
```

`put` adds a key-value pair, `get` retrieves the value for a key. Simple as that

---

**Step 1: The Student class**

Each student has a **name** and a **HashMap** that maps subject names to grades

```text
import java.util.HashMap;

class Student {
    String name;
    HashMap<String, Integer> grades;

    Student(String name) {
        this.name = name;
        this.grades = new HashMap<>();
    }
}
```

We create an empty HashMap in the constructor. The student starts with no grades — we'll add them later with a method

---

**Step 2: Adding grades**

```text
public class Main {
    void addGrade(String subject, int grade) {
        grades.put(subject, grade);
    }
}
```

Dead simple. `grades.put("Math", 95)` stores the grade 95 for Math. If the student already has a Math grade, it gets overwritten with the new one

---

**Step 3: Calculating the average**

To get the average, we need to sum all the grades and divide by how many there are. We loop through the HashMap's **values**

```text
public class Main {
    double getAverage() {
        int sum = 0;
        for (int grade : grades.values()) {
            sum += grade;
        }
        return (double) sum / grades.size();
    }
}
```

`grades.values()` gives us all the grade numbers. We sum them up, then divide by `grades.size()` (the number of subjects). The `(double)` cast makes sure we get decimal division, not integer division

---

**Step 4: Printing the report**

Let's print a nice report showing the student's name, each subject with its grade, and the average. We'll loop through the HashMap's **keySet** to get both keys and values

```text
public class Main {
    void printReport() {
        System.out.println("Student: " + name);
        for (String subject : grades.keySet()) {
            System.out.println("  " + subject + ": " + grades.get(subject));
        }
        System.out.println("  Average: " + String.format("%.1f", getAverage()));
    }
}
```

`grades.keySet()` gives us all the subject names. For each one, we print the subject and its grade. At the end, we print the average formatted to 1 decimal place

---

**Important note about HashMap ordering**

HashMaps do **NOT** guarantee order. If you add Math, English, Science — they might print in any order. That's just how HashMaps work internally. If you need a specific order, you'd use a `LinkedHashMap` instead (which preserves insertion order), but for now, regular HashMap is fine

For our exercise, we'll use a **LinkedHashMap** so the output is predictable

```text
import java.util.LinkedHashMap;

class Student {
    String name;
    LinkedHashMap<String, Integer> grades;

    Student(String name) {
        this.name = name;
        this.grades = new LinkedHashMap<>();
    }
}
```

LinkedHashMap works exactly like HashMap but remembers the order you added things. Think of it like Vice City's stats screen — it always shows your stats in the same order

---

**Full example**

```java
import java.util.LinkedHashMap;

class Student {
    String name;
    LinkedHashMap<String, Integer> grades;

    Student(String name) {
        this.name = name;
        this.grades = new LinkedHashMap<>();
    }

    void addGrade(String subject, int grade) {
        grades.put(subject, grade);
    }

    double getAverage() {
        int sum = 0;
        for (int grade : grades.values()) {
            sum += grade;
        }
        return (double) sum / grades.size();
    }

    void printReport() {
        System.out.println("Student: " + name);
        for (String subject : grades.keySet()) {
            System.out.println("  " + subject + ": " + grades.get(subject));
        }
        System.out.println("  Average: " + String.format("%.1f", getAverage()));
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Tommy");
        s1.addGrade("Math", 85);
        s1.addGrade("English", 92);
        s1.addGrade("Science", 78);
        s1.printReport();
    }
}
```

Output

```text
Student: Tommy
  Math: 85
  English: 92
  Science: 78
  Average: 85.0
```

---

Notice how we used **composition** again — a Student **has a** HashMap of grades. This is the same pattern as the Inventory project where Inventory **has an** ArrayList of Items. Real-world Java is full of this: objects containing other objects, each with their own responsibilities

The Student class is self-contained — it knows how to add grades, calculate its own average, and print its own report. Each object manages its own data. That's good OOP design

---

## Mission: Academy Transcript Generator

The station's training academy just finished exams. Each cadet has grades in multiple subjects, and the academy director needs a printed transcript for every student showing their scores and average.

1. Create a `Student` class with a `name` (String) and a `LinkedHashMap<String, Integer>` for grades
2. Add methods: `addGrade(String subject, int grade)`, `double getAverage()`, `printReport()`
3. `printReport()` should print:
   - `"Student: NAME"` on the first line
   - `"  SUBJECT: GRADE"` for each subject (two spaces before each)
   - `"  Average: X.X"` at the end (one decimal place, two spaces before)
4. In main, create two students:
   - "Tommy" with grades: Math 90, English 85, Science 92
   - "Lance" with grades: Math 78, English 82, Science 88
5. Print both reports

**Output**

```text
Student: Tommy
  Math: 90
  English: 85
  Science: 92
  Average: 89.0
Student: Lance
  Math: 78
  English: 82
  Science: 88
  Average: 82.7
```
