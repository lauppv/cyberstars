import java.util.*;

class Student implements Comparable<Student> {
    final String name;
    final double gpa;

    Student(String name, double gpa) {
        this.name = name;
        this.gpa = gpa;
    }

    public int compareTo(Student other) {
        return 0;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        List<Student> list = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            String name = in.nextLine();
            list.add(new Student(name, Double.parseDouble(in.nextLine())));
        }
        list.sort((a, b) -> a.gpa != b.gpa ? Double.compare(b.gpa, a.gpa) : a.name.compareTo(b.name));
        for (Student s : list) System.out.printf("%s %.1f%n", s.name, s.gpa);
    }
}
