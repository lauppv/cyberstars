import java.util.*;

public class Main {
    public static void main(String[] args) {
        String text = new Scanner(System.in).nextLine().trim();
        System.out.println(new StringBuilder(text).reverse().toString().equals(text));
    }
}
