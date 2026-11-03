import java.util.*;

class StringAnalyzer {
    private final String text;

    StringAnalyzer(String text) {
        this.text = text;
    }

    int vowelCount() {
        int n = 0;
        for (char c : text.toCharArray()) if ("aeiou".indexOf(c) >= 0) n++;
        return n;
    }

    int consonantCount() {
        int n = 0;
        for (char c : text.toCharArray()) if (Character.isLetter(c)) n++;
        return n - vowelCount();
    }

    int wordCount() {
        return text.split(" ").length;
    }
}

public class Main {
    public static void main(String[] args) {
        StringAnalyzer a = new StringAnalyzer(new Scanner(System.in).nextLine());
        System.out.println("Vowels: " + a.vowelCount());
        System.out.println("Consonants: " + a.consonantCount());
        System.out.println("Words: " + a.wordCount());
    }
}
