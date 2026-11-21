```java
public class Main {
    static String inverseaza(String s) {
        if (s.isEmpty()) {
            return "";
        }
        return inverseaza(s.substring(1)) + s.charAt(0);
    }

    static boolean estePalindrom(String s) {
        if (s.length() < 2) {
            return true;
        }
        if (s.charAt(0) != s.charAt(s.length() - 1)) {
            return false;
        }
        return estePalindrom(s.substring(1, s.length() - 1));
    }

    public static void main(String[] args) {
        String cuvant = "level";

        System.out.println(inverseaza(cuvant));
        System.out.println("Palindrom: " + (estePalindrom(cuvant) ? "da" : "nu"));
    }
}
```
