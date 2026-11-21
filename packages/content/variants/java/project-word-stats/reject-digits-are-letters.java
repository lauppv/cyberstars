import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

public class Main {
    static ArrayList<String> wordsOf(String line) {
        ArrayList<String> words = new ArrayList<>();
        StringBuilder word = new StringBuilder();
        for (char ch : (line + " ").toCharArray()) {
            if (Character.isLetterOrDigit(ch)) {
                word.append(Character.toLowerCase(ch));
            } else if (word.length() > 0) {
                words.add(word.toString());
                word.setLength(0);
            }
        }
        return words;
    }

    public static void main(String[] args) throws IOException {
        String text = "The money is in the boat.\nTommy says: the money is safe, Lance!";

        try (PrintWriter out = new PrintWriter(new FileWriter("letter.txt"))) {
            out.print(text);
        }

        List<String> lines = Files.readAllLines(Path.of("letter.txt"));
        TreeMap<String, Integer> count = new TreeMap<>();
        int total = 0;
        for (String line : lines) {
            for (String w : wordsOf(line)) {
                count.put(w, count.getOrDefault(w, 0) + 1);
                total++;
            }
        }

        String longest = count.keySet().stream()
            .max((a, b) -> a.length() - b.length())
            .orElse("");

        System.out.println("Lines: " + lines.size());
        System.out.println("Words: " + total);
        System.out.println("Different words: " + count.size());
        System.out.println("Longest: " + longest);
        System.out.println("Top 3:");

        int[] place = {1};
        count.entrySet().stream()
            .sorted((a, b) -> {
                if (!a.getValue().equals(b.getValue())) {
                    return b.getValue() - a.getValue();
                }
                return a.getKey().compareTo(b.getKey());
            })
            .limit(3)
            .forEach(e -> System.out.println(place[0]++ + ". " + e.getKey() + " (" + e.getValue() + ")"));
    }
}
