import java.util.*;

public class Main {
    public static void main(String[] args) {
        String text = new Scanner(System.in).nextLine().trim();
        System.out.println(!text.startsWith("-") && text.charAt(0) == text.charAt(text.length() - 1));
    }
}
