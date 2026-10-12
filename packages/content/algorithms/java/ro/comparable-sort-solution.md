```java
import java.util.ArrayList;
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
        // Media descrescator: cine are media mai mare vine primul.
        if (this.medie > altul.medie) {
            return -1;
        }
        if (this.medie < altul.medie) {
            return 1;
        }
        // Media egala: departajam alfabetic dupa nume.
        return this.nume.compareTo(altul.nume);
    }

    @Override
    public String toString() {
        return nume + " " + String.format("%.1f", medie);
    }
}

public class Main {
    static void sorteazaBule(List<Student> studenti) {
        int n = studenti.size();
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - 1 - i; j++) {
                if (studenti.get(j).compareTo(studenti.get(j + 1)) > 0) {
                    Student temp = studenti.get(j);
                    studenti.set(j, studenti.get(j + 1));
                    studenti.set(j + 1, temp);
                }
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        List<Student> studenti = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String nume = sc.nextLine();
            double medie = Double.parseDouble(sc.nextLine());
            studenti.add(new Student(nume, medie));
        }

        sorteazaBule(studenti);

        for (Student s : studenti) {
            System.out.println(s);
        }
    }
}
```
