import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String who = in.nextLine();
        int years = Integer.parseInt(in.nextLine().trim());
        System.out.printf("Hello %s, you are %d years old. Next year you will be %d%n", who, years, years + 1);
    }
}
