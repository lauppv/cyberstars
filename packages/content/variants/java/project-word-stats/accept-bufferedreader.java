import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) throws IOException {
        String text = "The money is in the boat.\nTommy says: the money is safe, Lance!";
        try (PrintWriter out = new PrintWriter(new FileWriter("letter.txt"))) {
            out.print(text);
        }
        TreeMap<String, Integer> count = new TreeMap<>();
        int lines = 0, total = 0;
        try (BufferedReader in = new BufferedReader(new FileReader("letter.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                lines++;
                String w = "";
                for (int i = 0; i <= line.length(); i++) {
                    char ch = i < line.length() ? line.charAt(i) : ' ';
                    if (Character.isLetter(ch)) w += Character.toLowerCase(ch);
                    else if (!w.isEmpty()) { count.put(w, count.getOrDefault(w, 0) + 1); total++; w = ""; }
                }
            }
        }
        System.out.println("Lines: " + lines);
        System.out.println("Words: " + total);
        System.out.println("Different words: " + count.size());
        System.out.println("Longest: " + count.keySet().stream().reduce("", (a, b) -> b.length() > a.length() ? b : a));
        System.out.println("Top 3:");
        ArrayList<String> keys = new ArrayList<>(count.keySet());
        keys.sort((a, b) -> count.get(b) - count.get(a));
        for (int i = 0; i < Math.min(3, keys.size()); i++)
            System.out.println((i + 1) + ". " + keys.get(i) + " (" + count.get(keys.get(i)) + ")");
    }
}
