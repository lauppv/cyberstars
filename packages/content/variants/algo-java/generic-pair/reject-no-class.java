import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        String word = in.nextLine();
        int number = Integer.parseInt(in.nextLine());
        System.out.println("(" + word + ", " + number + ")");
        System.out.println("(" + number + ", " + word + ")");
    }
}
