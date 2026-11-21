```java
public class Main {
    static String reverse(String s) {
        if (s.isEmpty()) {
            return "";
        }
        return reverse(s.substring(1)) + s.charAt(0);
    }

    static boolean isPalindrome(String s) {
        if (s.length() < 2) {
            return true;
        }
        if (s.charAt(0) != s.charAt(s.length() - 1)) {
            return false;
        }
        return isPalindrome(s.substring(1, s.length() - 1));
    }

    public static void main(String[] args) {
        String word = "level";

        System.out.println(reverse(word));
        System.out.println("Palindrome: " + (isPalindrome(word) ? "yes" : "no"));
    }
}
```
