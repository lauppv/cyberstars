import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] contacts = {"Kent Paul", "Lance Vance", "Ken Rosenberg", "Phil Cassidy"};
        String[] searches = {"Ken", "Lan", "Son", "Ken R"};
        ArrayList<String> phone = new ArrayList<>();
        for (String c : contacts) phone.add(c);
        for (String s : searches) {
            String hit = phone.stream().filter(c -> c.startsWith(s)).reduce("no one", (a, b) -> b);
            System.out.println(s + ": " + hit);
            phone.stream().findFirst();
        }
    }
}
