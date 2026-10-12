import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String crewName = sc.nextLine();
        int crewAge = sc.nextInt();
        int nextYear = crewAge + 1;
        String msg = String.format("Hello %s, you are %d years old. Next year you will be %d", crewName, crewAge, nextYear);
        System.out.println(msg);
    }
}
