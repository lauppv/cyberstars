```java
import java.util.LinkedHashMap;

class Student {
    String nume;
    LinkedHashMap<String, Integer> note;

    Student(String nume) {
        this.nume = nume;
        this.note = new LinkedHashMap<>();
    }

    void adaugaNota(String materie, int nota) {
        note.put(materie, nota);
    }

    double getMedia() {
        int suma = 0;
        for (int nota : note.values()) {
            suma += nota;
        }
        return (double) suma / note.size();
    }

    void afiseazaRaport() {
        System.out.println("Student: " + nume);
        for (String materie : note.keySet()) {
            System.out.println("  " + materie + ": " + note.get(materie));
        }
        System.out.println("  Media: " + String.format("%.1f", getMedia()));
    }
}

public class Main {
    public static void main(String[] args) {
        Student s1 = new Student("Tommy");
        s1.adaugaNota("Mate", 90);
        s1.adaugaNota("Engleza", 85);
        s1.adaugaNota("Stiinte", 92);
        s1.afiseazaRaport();

        Student s2 = new Student("Lance");
        s2.adaugaNota("Mate", 78);
        s2.adaugaNota("Engleza", 82);
        s2.adaugaNota("Stiinte", 88);
        s2.afiseazaRaport();
    }
}
```
