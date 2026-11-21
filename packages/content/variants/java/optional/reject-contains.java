import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String[] contacts = {"Kent Paul", "Lance Vance", "Ken Rosenberg", "Phil Cassidy"};
        String[] searches = {"Ken", "Lan", "Son", "Ken R"};
        ArrayList<String> phone = new ArrayList<>();
        for (String c : contacts) phone.add(c);
        for (String s : searches) {
            System.out.println(s + ": " + phone.stream().filter(c -> c.contains(s)).findFirst().orElse("no one"));
        }
    }
}
