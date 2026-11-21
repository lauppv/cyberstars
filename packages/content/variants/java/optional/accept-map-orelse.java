import java.util.ArrayList;
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        String[] contacts = {"Kent Paul", "Lance Vance", "Ken Rosenberg", "Phil Cassidy"};
        String[] searches = {"Ken", "Lan", "Son", "Ken R"};
        ArrayList<String> phone = new ArrayList<>();
        for (int i = 0; i < contacts.length; i++) phone.add(contacts[i]);
        for (int i = 0; i < searches.length; i++) {
            String q = searches[i];
            Optional<String> f = phone.stream().filter(c -> c.indexOf(q) == 0).findFirst();
            System.out.println(f.map(c -> q + ": " + c).orElse(q + ": no one"));
        }
    }
}
