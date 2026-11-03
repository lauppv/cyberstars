import java.util.*;

public class Main {
    public static void main(String[] args) {
        long n = Math.abs(Long.parseLong(new Scanner(System.in).nextLine().trim()));
        String text = Long.toString(n);
        System.out.println(new StringBuilder(text).reverse().toString().equals(text));
    }
}
