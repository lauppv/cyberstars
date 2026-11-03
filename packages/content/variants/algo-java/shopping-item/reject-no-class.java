import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        double total = 0;
        for (int i = 0; i < n; i++) {
            in.nextLine();
            double price = Double.parseDouble(in.nextLine());
            total += price * Integer.parseInt(in.nextLine());
        }
        System.out.printf("Total: %.2f%n", total);
    }
}
