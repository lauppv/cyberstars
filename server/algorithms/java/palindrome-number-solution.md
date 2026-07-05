```java
import java.util.Scanner;

public class Main {
    static boolean isPalindrome(int number) {
        if (number < 0) {
            return false;
        }

        int original = number;
        int reversed = 0;
        while (number > 0) {
            int digit = number % 10;
            reversed = reversed * 10 + digit;
            number = number / 10;
        }

        return original == reversed;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int number = Integer.parseInt(sc.nextLine().trim());
        System.out.println(isPalindrome(number));
    }
}
```
