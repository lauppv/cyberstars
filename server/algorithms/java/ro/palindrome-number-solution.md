```java
import java.util.Scanner;

public class Main {
    static boolean estePalindrom(int numar) {
        if (numar < 0) {
            return false;
        }
        String s = Integer.toString(numar);
        String inversat = new StringBuilder(s).reverse().toString();
        return s.equals(inversat);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int numar = Integer.parseInt(sc.nextLine().trim());
        System.out.println(estePalindrom(numar));
    }
}
```
