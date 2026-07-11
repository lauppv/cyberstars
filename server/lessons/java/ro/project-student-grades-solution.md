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
        String nume1 = "Tommy";
        int mate1 = 90;
        int engleza1 = 85;
        int stiinte1 = 92;
        String nume2 = "Lance";
        int mate2 = 78;
        int engleza2 = 82;
        int stiinte2 = 88;

        Student s1 = new Student(nume1);
        s1.adaugaNota("Mate", mate1);
        s1.adaugaNota("Engleza", engleza1);
        s1.adaugaNota("Stiinte", stiinte1);
        s1.afiseazaRaport();

        Student s2 = new Student(nume2);
        s2.adaugaNota("Mate", mate2);
        s2.adaugaNota("Engleza", engleza2);
        s2.adaugaNota("Stiinte", stiinte2);
        s2.afiseazaRaport();
    }
}
```
