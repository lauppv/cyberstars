```java
import java.util.Scanner;

public class Main {
    static boolean isPalindrome(int number) {
        // Negative numbers are never palindromes because of the sign.
        if (number < 0) {
            return false;
        }

        // Idea: reverse the digits into a second number and compare with the original.
        // Extract the last digit (number % 10), stick it at the end of "reversed",
        // then chop the last digit off number (number / 10).
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
        int number = Integer.parseInt(sc.nextLine());
        System.out.println(isPalindrome(number));
    }
}
```
