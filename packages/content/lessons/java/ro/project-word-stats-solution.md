```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.TreeMap;

public class Main {
    static ArrayList<String> cuvinteDin(String rand) {
        ArrayList<String> cuvinte = new ArrayList<>();
        StringBuilder cuvant = new StringBuilder();
        for (char ch : (rand + " ").toCharArray()) {
            if (Character.isLetter(ch)) {
                cuvant.append(Character.toLowerCase(ch));
            } else if (cuvant.length() > 0) {
                cuvinte.add(cuvant.toString());
                cuvant.setLength(0);
            }
        }
        return cuvinte;
    }

    public static void main(String[] args) throws IOException {
        String text = "Banii sunt in barca.\nTommy spune: banii sunt in siguranta, Lance!";

        try (PrintWriter out = new PrintWriter(new FileWriter("scrisoare.txt"))) {
            out.print(text);
        }

        List<String> randuri = Files.readAllLines(Path.of("scrisoare.txt"));
        TreeMap<String, Integer> numar = new TreeMap<>();
        int total = 0;
        for (String rand : randuri) {
            for (String w : cuvinteDin(rand)) {
                numar.put(w, numar.getOrDefault(w, 0) + 1);
                total++;
            }
        }

        String celMaiLung = numar.keySet().stream()
            .max((a, b) -> a.length() - b.length())
            .orElse("");

        System.out.println("Randuri: " + randuri.size());
        System.out.println("Cuvinte: " + total);
        System.out.println("Cuvinte diferite: " + numar.size());
        System.out.println("Cel mai lung: " + celMaiLung);
        System.out.println("Primele 3:");

        int[] loc = {1};
        numar.entrySet().stream()
            .sorted((a, b) -> {
                if (!a.getValue().equals(b.getValue())) {
                    return b.getValue() - a.getValue();
                }
                return a.getKey().compareTo(b.getKey());
            })
            .limit(3)
            .forEach(e -> System.out.println(loc[0]++ + ". " + e.getKey() + " (" + e.getValue() + ")"));
    }
}
```
