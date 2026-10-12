import java.util.LinkedHashMap;
import java.util.Map;

class Student {
    private final String name;
    private final Map<String, Integer> marks = new LinkedHashMap<>();
    private int sum;

    Student(String name) {
        this.name = name;
    }

    void addGrade(String subject, int grade) {
        marks.put(subject, grade);
        sum += grade;
    }

    double getAverage() {
        return sum / (double) marks.size();
    }

    void printReport() {
        StringBuilder sb = new StringBuilder("Student: ").append(name).append('\n');
        for (Map.Entry<String, Integer> e : marks.entrySet()) {
            sb.append("  ").append(e.getKey()).append(": ").append(e.getValue()).append('\n');
        }
        sb.append(String.format("  Average: %.1f", getAverage()));
        System.out.println(sb);
    }
}

public class Main {
    public static void main(String[] args) {
        String name1 = "Tommy";
        int math1 = 90;
        int english1 = 85;
        int science1 = 92;
        String name2 = "Lance";
        int math2 = 78;
        int english2 = 82;
        int science2 = 88;

        Student[] students = { new Student(name1), new Student(name2) };
        int[][] grades = { { math1, english1, science1 }, { math2, english2, science2 } };
        String[] subjects = { "Math", "English", "Science" };
        for (int i = 0; i < students.length; i++) {
            for (int j = 0; j < subjects.length; j++) {
                students[i].addGrade(subjects[j], grades[i][j]);
            }
            students[i].printReport();
        }
    }
}
