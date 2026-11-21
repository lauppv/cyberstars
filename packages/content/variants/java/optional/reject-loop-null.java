public class Main {
    public static void main(String[] args) {
        String[] contacts = {"Kent Paul", "Lance Vance", "Ken Rosenberg", "Phil Cassidy"};
        String[] searches = {"Ken", "Lan", "Son", "Ken R"};
        for (String s : searches) {
            String hit = null;
            for (String c : contacts) {
                if (c.startsWith(s)) { hit = c; break; }
            }
            System.out.println(s + ": " + (hit == null ? "no one" : hit));
        }
    }
}
