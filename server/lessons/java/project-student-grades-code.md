import java.util.LinkedHashMap;

class Student {
    String name;
    LinkedHashMap<String, Integer> grades;

    Student(String name) {
        this.name = name;
        this.grades = new LinkedHashMap<>();
    }

    void addGrade(String subject, int grade) {
        // Add the subject and grade to the HashMap

    }

    double getAverage() {
        // Sum all grades and divide by the number of subjects
        return 0;
    }

    void printReport() {
        // Print "Student: NAME"
        // For each subject: print "  SUBJECT: GRADE"
        // Print "  Average: X.X" (one decimal place)

    }

}

public class Main {
    public static void main(String[] args) {
        // Create student "Tommy" with Math 90, English 85, Science 92
        // Create student "Lance" with Math 78, English 82, Science 88
        // Print both reports

    }

}
