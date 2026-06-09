import java.util.LinkedHashMap;

class Student {
    String name;
    LinkedHashMap<String, Integer> grades;

    Student(String name) {
        this.name = name;
        this.grades = new LinkedHashMap<>();
    }

    void addGrade(String subject, int grade) {
    }

    double getAverage() {
        return 0;
    }

    void printReport() {
    }
}

public class Main {
    public static void main(String[] args) {
    }
}
