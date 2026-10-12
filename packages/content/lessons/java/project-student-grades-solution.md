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
        String name1 = "Tommy";
        int math1 = 90;
        int english1 = 85;
        int science1 = 92;
        String name2 = "Lance";
        int math2 = 78;
        int english2 = 82;
        int science2 = 88;

        Student s1 = new Student(name1);
        s1.addGrade("Math", math1);
        s1.addGrade("English", english1);
        s1.addGrade("Science", science1);
        s1.printReport();

        Student s2 = new Student(name2);
        s2.addGrade("Math", math2);
        s2.addGrade("English", english2);
        s2.addGrade("Science", science2);
        s2.printReport();
    }
}
```
