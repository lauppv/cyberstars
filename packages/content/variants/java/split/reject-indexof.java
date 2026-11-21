public class Main {
    public static void main(String[] args) {
        String results = "Tommy:120;Lance:85;Ken:40";
        int total = 0, bestScore = -1;
        String best = "";
        String rest = results + ";";
        while (rest.length() > 0) {
            int end = rest.indexOf(';');
            String record = rest.substring(0, end);
            rest = rest.substring(end + 1);
            int colon = record.indexOf(':');
            String name = record.substring(0, colon);
            int score = Integer.parseInt(record.substring(colon + 1));
            System.out.println(name + " - " + score);
            total += score;
            if (score > bestScore) { bestScore = score; best = name; }
        }
        System.out.println("Total: " + total);
        System.out.println("Best: " + best);
    }
}
