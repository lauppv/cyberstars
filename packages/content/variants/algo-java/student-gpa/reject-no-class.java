import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        in.nextLine();
        int n = Integer.parseInt(in.nextLine());
        int sum = 0;
        for (int i = 0; i < n; i++) sum += Integer.parseInt(in.nextLine());
        System.out.printf("%.2f%n", (double) sum / n);
    }
}
