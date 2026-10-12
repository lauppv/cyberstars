public class Main {
    static String field(String label, Object value) {
        return label + ": " + value;
    }

    public static void main(String[] args) {
        String name = "Tommy Vercetti";
        int score = 1500;
        double rating = 4.75;
        String joined = String.join(" | ", field("Player", name), field("Score", score));
        System.out.printf("%s | Rating: %.2f%n", joined, rating);
    }
}
