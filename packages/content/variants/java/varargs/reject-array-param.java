public class Main {
    static String roll(String leader, String[] members) {
        if (members.length == 0) {
            return leader + " works alone";
        }
        return leader + " leads " + members.length + ": " + String.join(", ", members);
    }

    public static void main(String[] args) {
        String leader = "Tommy";
        String[] crew = { "Lance", "Ken" };
        System.out.println(roll(leader, crew));
        System.out.println(roll(leader, new String[0]));
    }
}
