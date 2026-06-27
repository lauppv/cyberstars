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
        s1.addGrade("Math", 90);
        s1.addGrade("English", 85);
        s1.addGrade("Science", 92);
        s1.printReport();

        Student s2 = new Student("Lance");
        s2.addGrade("Math", 78);
        s2.addGrade("English", 82);
        s2.addGrade("Science", 88);
        s2.printReport();
    }
}
```
