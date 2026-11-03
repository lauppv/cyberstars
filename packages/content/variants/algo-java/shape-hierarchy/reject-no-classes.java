import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        double total = 0;
        for (int i = 0; i < n; i++) {
            if (in.nextLine().equals("circle")) {
                double r = Double.parseDouble(in.nextLine());
                total += Math.PI * r * r;
            } else {
                total += Double.parseDouble(in.nextLine()) * Double.parseDouble(in.nextLine());
            }
        }
        System.out.printf("Total: %.2f%n", total);
    }
}
