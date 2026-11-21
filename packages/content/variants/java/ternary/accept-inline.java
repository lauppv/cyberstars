public class Main {
    public static void main(String[] args) {
        int stars = 3;
        System.out.println("Wanted: " + stars + (stars == 1 ? " star" : " stars"));
        System.out.println(stars >= 1 ? "Police: chasing" : "Police: calm");
    }
}
