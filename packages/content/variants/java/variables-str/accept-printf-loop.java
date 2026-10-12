public class Main {
    public static void main(String[] args) {
        String hero1 = "Lance Vance";
        String hero2 = "Diaz";
        String hero3 = "Mercedes";

        String[] crew = { hero1, hero2, hero3 };
        for (String member : crew) {
            System.out.printf("%s%n", member);
        }
    }
}
