```java
import java.util.Scanner;

class Student {
    private final String nume;
    private final int[] note;

    Student(String nume, int[] note) {
        this.nume = nume;
        this.note = note;
    }

    double getGPA() {
        int suma = 0;
        for (int nota : note) {
            suma += nota;
        }
        return (double) suma / note.length;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String nume = sc.nextLine().trim();
        String[] parti = sc.nextLine().trim().split("\\s+");
        int[] note = new int[parti.length];
        for (int i = 0; i < parti.length; i++) {
            note[i] = Integer.parseInt(parti[i]);
        }
        Student student = new Student(nume, note);
        System.out.printf("%.2f%n", student.getGPA());
    }
}
```
