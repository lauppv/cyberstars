public class Main {
    static String reverse(String s) {
        return s.length() <= 1 ? s : s.charAt(s.length() - 1) + reverse(s.substring(0, s.length() - 1));
    }

    static boolean isPalindrome(String s) {
        return s.length() < 2 || (s.charAt(0) == s.charAt(s.length() - 1) && isPalindrome(s.substring(1, s.length() - 1)));
    }

    public static void main(String[] args) {
        String word = "level";
        String back = reverse(word);
        System.out.println(back);
        System.out.println(isPalindrome(word) ? "Palindrome: yes" : "Palindrome: no");
    }
}
