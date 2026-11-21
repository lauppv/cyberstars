import java.io.*;
import java.nio.file.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        String text = "The money is in the boat.\nTommy says: the money is safe, Lance!";
        try (FileWriter fw = new FileWriter("letter.txt")) {
            fw.write(text);
        }
        List<String> lines = Files.readAllLines(Paths.get("letter.txt"));
        Map<String, Integer> freq = new TreeMap<>();
        int words = 0;
        for (String line : lines) {
            for (String w : line.toLowerCase().split("[^\\p{L}]+")) {
                if (w.isEmpty()) continue;
                freq.merge(w, 1, Integer::sum);
                words++;
            }
        }
        String longest = "";
        for (String w : freq.keySet()) if (w.length() > longest.length()) longest = w;
        System.out.println("Lines: " + lines.size());
        System.out.println("Words: " + words);
        System.out.println("Different words: " + freq.size());
        System.out.println("Longest: " + longest);
        System.out.println("Top 3:");
        List<Map.Entry<String, Integer>> top = freq.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(3)
            .toList();
        for (int i = 0; i < top.size(); i++)
            System.out.println((i + 1) + ". " + top.get(i).getKey() + " (" + top.get(i).getValue() + ")");
    }
}
