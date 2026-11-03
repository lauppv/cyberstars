import java.util.*;

class Student {
    private final int[] grades;

    Student(int[] grades) {
        this.grades = grades;
    }

    double getGPA() {
        int sum = 0;
        for (int g : grades) sum += g;
        return sum / grades.length;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        in.nextLine();
        int n = Integer.parseInt(in.nextLine());
        int[] grades = new int[n];
        for (int i = 0; i < n; i++) grades[i] = Integer.parseInt(in.nextLine());
        System.out.printf("%.2f%n", new Student(grades).getGPA());
    }
}
