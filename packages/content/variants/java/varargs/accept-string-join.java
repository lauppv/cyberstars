public class Main {
    static String roll(String boss, String... others) {
        String line = boss;
        if (others.length > 0) {
            line += " leads " + others.length + ": " + String.join(", ", others);
        } else {
            line += " works alone";
        }
        return line;
    }

    public static void main(String[] args) {
        String leader = "Tommy";
        String[] crew = { "Lance", "Ken" };
        System.out.println(roll(leader, crew));
        System.out.println(roll(leader));
    }
}
