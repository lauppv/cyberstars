```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Student implements Comparable<Student> {
    String name;
    double gpa;

    Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    @Override
    public int compareTo(Student other) {
        // GPA descending: higher GPA comes first.
        if (this.gpa > other.gpa) {
            return -1;
        }
        if (this.gpa < other.gpa) {
            return 1;
        }
        // Same GPA: break the tie alphabetically by name.
        return this.name.compareTo(other.name);
    }

    @Override
    public String toString() {
        return name + " " + String.format("%.1f", gpa);
    }
}

public class Main {
    static void bubbleSort(List<Student> students) {
        int n = students.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (students.get(j).compareTo(students.get(j + 1)) > 0) {
                    Student tmp = students.get(j);
                    students.set(j, students.get(j + 1));
                    students.set(j + 1, tmp);
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        List<Student> students = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String name = sc.nextLine();
            double gpa = Double.parseDouble(sc.nextLine());
            students.add(new Student(name, gpa));
        }

        bubbleSort(students);

        for (Student s : students) {
            System.out.println(s);
        }
    }
}
```
