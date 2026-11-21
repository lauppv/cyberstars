import java.io.*;

public class Main {
    public static void main(String[] args) {
        String[] lines = {"Tommy,47", "Lance,12", "Mercedes,23"};
        try {
            FileWriter fw = new FileWriter("crew.txt");
            for (String l : lines) fw.write(l + "\n");
            fw.close();
            BufferedReader br = new BufferedReader(new FileReader("crew.txt"));
            int sum = 0, top = Integer.MIN_VALUE;
            String who = null;
            for (String row = br.readLine(); row != null; row = br.readLine()) {
                int comma = row.indexOf(',');
                String name = row.split(",")[0];
                int n = Integer.parseInt(row.substring(comma + 1));
                System.out.println(name + ": " + n + " missions");
                sum += n;
                if (n > top) { top = n; who = name; }
            }
            br.close();
            System.out.println("Total: " + sum);
            System.out.println("Most: " + who);
        } catch (IOException e) {
            System.out.println("File trouble");
        }
    }
}
