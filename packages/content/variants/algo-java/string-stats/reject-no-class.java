import java.util.*;

public class Main {
    public static void main(String[] args) {
        String text = new Scanner(System.in).nextLine();
        int vowels = 0, letters = 0;
        for (char c : text.toLowerCase().toCharArray()) {
            if (Character.isLetter(c)) letters++;
            if ("aeiou".indexOf(c) >= 0) vowels++;
        }
        System.out.println("Vowels: " + vowels);
        System.out.println("Consonants: " + (letters - vowels));
        System.out.println("Words: " + text.split(" ").length);
    }
}
