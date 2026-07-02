```java
import java.util.Scanner;

class StringAnalyzer {
    private final String text;

    StringAnalyzer(String text) {
        this.text = text;
    }

    int vowelCount() {
        int count = 0;
        for (char c : text.toLowerCase().toCharArray()) {
            if ("aeiou".indexOf(c) >= 0) {
                count++;
            }
        }
        return count;
    }

    int consonantCount() {
        int count = 0;
        for (char c : text.toLowerCase().toCharArray()) {
            if (Character.isLetter(c) && "aeiou".indexOf(c) < 0) {
                count++;
            }
        }
        return count;
    }

    int wordCount() {
        String trimmed = text.trim();
        if (trimmed.isEmpty()) {
            return 0;
        }
        return trimmed.split("\\s+").length;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String line = sc.nextLine();
        StringAnalyzer analyzer = new StringAnalyzer(line);
        System.out.println("Vowels: " + analyzer.vowelCount());
        System.out.println("Consonants: " + analyzer.consonantCount());
        System.out.println("Words: " + analyzer.wordCount());
    }
}
```
