```java
import java.util.Scanner;

class StringAnalyzer {
    private final String text;

    StringAnalyzer(String text) {
        this.text = text;
    }

    int vowelCount() {
        int numar = 0;
        for (char c : text.toLowerCase().toCharArray()) {
            if ("aeiou".indexOf(c) >= 0) {
                numar++;
            }
        }
        return numar;
    }

    int consonantCount() {
        int numar = 0;
        for (char c : text.toLowerCase().toCharArray()) {
            if (Character.isLetter(c) && "aeiou".indexOf(c) < 0) {
                numar++;
            }
        }
        return numar;
    }

    int wordCount() {
        String curatat = text.trim();
        if (curatat.isEmpty()) {
            return 0;
        }
        return curatat.split("\\s+").length;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String linie = sc.nextLine();
        StringAnalyzer analizator = new StringAnalyzer(linie);
        System.out.println("Vowels: " + analizator.vowelCount());
        System.out.println("Consonants: " + analizator.consonantCount());
        System.out.println("Words: " + analizator.wordCount());
    }
}
```
