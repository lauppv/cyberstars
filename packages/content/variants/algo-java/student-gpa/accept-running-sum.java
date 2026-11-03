import java.util.*;

class Student {
    private long sum;
    private int count;

    void addGrade(int grade) {
        sum += grade;
        count++;
    }

    double average() {
        return (double) sum / count;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        in.next();
        int n = in.nextInt();
        Student s = new Student();
        for (int i = 0; i < n; i++) s.addGrade(in.nextInt());
        System.out.printf("%.2f%n", s.average());
    }
}
