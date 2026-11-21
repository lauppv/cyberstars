public class Main {
    public static void main(String[] args) {
        int stars = 3;
        String[] words = {"stars", "star"};
        String[] moods = {"calm", "chasing"};
        String word = words[Boolean.compare(stars == 1, false)];
        String police = moods[Boolean.compare(stars > 0, false)];
        System.out.println("Wanted: " + stars + " " + word);
        System.out.println("Police: " + police);
    }
}
