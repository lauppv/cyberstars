```java
import java.util.Scanner;

class Student {
    private final String name;
    private final int[] grades;

    Student(String name, int[] grades) {
        this.name = name;
        this.grades = grades;
    }

    double getGPA() {
        int sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        return (double) sum / grades.length;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String name = sc.nextLine().trim();
        String[] parts = sc.nextLine().trim().split("\\s+");
        int[] grades = new int[parts.length];
        for (int i = 0; i < parts.length; i++) {
            grades[i] = Integer.parseInt(parts[i]);
        }
        Student student = new Student(name, grades);
        System.out.printf("%.2f%n", student.getGPA());
    }
}
```
