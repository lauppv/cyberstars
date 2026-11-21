public class Main {
    public static void main(String[] args) {
        String results = "Tommy:120;Lance:85;Ken:40";
        int total = 0, bestScore = -1;
        String best = "";
        for (String record : results.split(";")) {
            String[] fields = record.split(":");
            int score = Integer.parseInt(fields[1]);
            System.out.println(fields[0] + " - " + score);
            total += score;
            if (score >= bestScore) { bestScore = score; best = fields[0]; }
        }
        System.out.println("Total: " + total);
        System.out.println("Best: " + best);
    }
}
