import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        int value = 0;
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            if (cmd.equals("inc")) value++;
            else if (cmd.equals("dec")) value--;
            else System.out.println(value);
        }
    }
}
