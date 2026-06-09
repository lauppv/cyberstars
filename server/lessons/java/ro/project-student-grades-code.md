import java.util.LinkedHashMap;

class Student {
    String nume;
    LinkedHashMap<String, Integer> note;

    Student(String nume) {
        this.nume = nume;
        this.note = new LinkedHashMap<>();
    }

    void adaugaNota(String materie, int nota) {
        // Adaugă materia și nota în HashMap

    }

    double getMedia() {
        // Adună toate notele și împarte la numărul de materii
        return 0;
    }

    void afiseazaRaport() {
        // Afișează "Student: NUME"
        // Pentru fiecare materie: afișează "  MATERIE: NOTA"
        // Afișează "  Media: X.X" (o zecimală)

    }

}

public class Main {
    public static void main(String[] args) {
        // Creează studentul "Tommy" cu Math 90, English 85, Science 92
        // Creează studentul "Lance" cu Math 78, English 82, Science 88
        // Afișează ambele rapoarte

    }

}
