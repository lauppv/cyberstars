```java
import java.util.Scanner;

class Student {
    private final String nume;
    private final int[] note;

    Student(String nume, int[] note) {
        this.nume = nume;
        this.note = note;
    }

    double getMedie() {
        int suma = 0;
        for (int i = 0; i < note.length; i++) {
            suma = suma + note[i];
        }
        return (double) suma / note.length;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        String nume = sc.nextLine();
        int n = Integer.parseInt(sc.nextLine());

        int[] note = new int[n];
        for (int i = 0; i < n; i++) {
            note[i] = Integer.parseInt(sc.nextLine());
        }

        Student student = new Student(nume, note);
        System.out.printf("%.2f%n", student.getMedie());
    }
}
```
