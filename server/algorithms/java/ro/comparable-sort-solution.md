```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Scanner;

class Student implements Comparable<Student> {
    String nume;
    double medie;

    Student(String nume, double medie) {
        this.nume = nume;
        this.medie = medie;
    }

    @Override
    public int compareTo(Student altul) {
        if (this.medie != altul.medie) {
            return Double.compare(altul.medie, this.medie);
        }
        return this.nume.compareTo(altul.nume);
    }

    @Override
    public String toString() {
        return nume + " " + String.format("%.1f", medie);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        List<Student> studenti = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String[] parti = sc.nextLine().trim().split("\\s+");
            studenti.add(new Student(parti[0], Double.parseDouble(parti[1])));
        }
        Collections.sort(studenti);
        for (Student s : studenti) {
            System.out.println(s);
        }
    }
}
```
