import java.util.LinkedHashMap;

public class Main {
    static class Student {
        String name;
        LinkedHashMap<String, Integer> grades = new LinkedHashMap<>();

        Student(String n) { name = n; }

        void addGrade(String subject, int grade) { grades.put(subject, grade); }

        double getAverage() {
            double total = 0;
            for (String s : grades.keySet()) total += grades.get(s);
            return total / grades.size();
        }

        void printReport() {
            System.out.printf("Student: %s%n", name);
            grades.forEach((s, g) -> System.out.printf("  %s: %d%n", s, g));
            System.out.printf("  Average: %.1f%n", getAverage());
        }
    }

    public static void main(String[] args) {
        String name1 = "Tommy";
        int math1 = 90, english1 = 85, science1 = 92;
        String name2 = "Lance";
        int math2 = 78, english2 = 82, science2 = 88;
        Student a = new Student(name1);
        Student b = new Student(name2);
        a.addGrade("Math", math1);
        a.addGrade("English", english1);
        a.addGrade("Science", science1);
        b.addGrade("Math", math2);
        b.addGrade("English", english2);
        b.addGrade("Science", science2);
        a.printReport();
        b.printReport();
    }
}
