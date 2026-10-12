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
        for (int i = 0; i < grades.length; i++) {
            sum = sum + grades[i];
        }
        return (double) sum / grades.length;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String name = sc.nextLine();
        int n = Integer.parseInt(sc.nextLine());

        int[] grades = new int[n];
        for (int i = 0; i < n; i++) {
            grades[i] = Integer.parseInt(sc.nextLine());
        }

        Student student = new Student(name, grades);
        System.out.printf("%.2f%n", student.getGPA());
    }
}
```
