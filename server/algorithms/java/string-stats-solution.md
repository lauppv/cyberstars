```java
import java.util.Scanner;

class StringAnalyzer {
    private final String text;

    StringAnalyzer(String text) {
        this.text = text;
    }

    private boolean isVowel(char c) {
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }

    private boolean isLetter(char c) {
        return c >= 'a' && c <= 'z';
    }

    int vowelCount() {
        String lower = text.toLowerCase();
        int count = 0;
        for (int i = 0; i < lower.length(); i++) {
            if (isVowel(lower.charAt(i))) {
                count = count + 1;
            }
        }
        return count;
    }

    int consonantCount() {
        String lower = text.toLowerCase();
        int count = 0;
        for (int i = 0; i < lower.length(); i++) {
            char c = lower.charAt(i);
            if (isLetter(c) && !isVowel(c)) {
                count = count + 1;
            }
        }
        return count;
    }

    int wordCount() {
        // A word starts when we transition from a space to a letter.
        // We use the flag pattern to count the transitions.
        int count = 0;
        boolean inWord = false;
        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            if (c != ' ') {
                if (!inWord) {
                    count = count + 1;
                    inWord = true;
                }
            } else {
                inWord = false;
            }
        }
        return count;
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
