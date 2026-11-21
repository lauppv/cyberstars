public class Main {
    static String reverse(String s) {
        if (s.isEmpty()) return "";
        return reverse(s.substring(1)) + s.charAt(0);
    }

    static boolean isPalindrome(String s) {
        return s.equals(reverse(s));
    }

    public static void main(String[] args) {
        String word = "level";
        System.out.println(reverse(word));
        System.out.println("Palindrome: " + (isPalindrome(word) ? "yes" : "no"));
    }
}
