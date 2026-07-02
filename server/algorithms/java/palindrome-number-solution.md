```java
import java.util.Scanner;

public class Main {
    static boolean isPalindrome(int number) {
        if (number < 0) {
            return false;
        }
        String s = Integer.toString(number);
        String reversed = new StringBuilder(s).reverse().toString();
        return s.equals(reversed);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int number = Integer.parseInt(sc.nextLine().trim());
        System.out.println(isPalindrome(number));
    }
}
```
