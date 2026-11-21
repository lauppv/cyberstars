import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) throws IOException {
        String[] lines = {"Tommy,47", "Lance,12", "Mercedes,23"};
        try (PrintWriter out = new PrintWriter(new FileWriter("crew.txt"))) {
            for (String line : lines) out.println(line);
        }
        ArrayList<String> names = new ArrayList<>();
        ArrayList<Integer> counts = new ArrayList<>();
        try (BufferedReader in = new BufferedReader(new FileReader("crew.txt"))) {
            String line;
            while ((line = in.readLine()) != null) {
                String[] p = line.split(",");
                names.add(p[0]);
                counts.add(Integer.parseInt(p[1]));
            }
        }
        int total = 0, best = 0;
        for (int i = 0; i < names.size(); i++) {
            System.out.println(names.get(i) + ": " + counts.get(i) + " missions");
            total += counts.get(i);
            if (counts.get(i) > counts.get(best)) best = i;
        }
        System.out.println("Total: " + total);
        System.out.println("Most: " + names.get(best));
    }
}
