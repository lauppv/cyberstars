public class Main {
    public static void main(String[] args) {
        int stars = 3;
        if (stars == 1) {
            System.out.println("Wanted: 1 star");
        } else {
            System.out.println("Wanted: " + stars + " stars");
        }
        System.out.println("Police: " + (stars > 0 ? "chasing" : "calm"));
    }
}
