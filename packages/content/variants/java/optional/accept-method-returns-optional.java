import java.util.*;

public class Main {
    static Optional<String> lookup(List<String> book, String start) {
        return book.stream().filter(name -> name.startsWith(start)).findFirst();
    }

    public static void main(String[] args) {
        String[] contacts = {"Kent Paul", "Lance Vance", "Ken Rosenberg", "Phil Cassidy"};
        String[] searches = {"Ken", "Lan", "Son", "Ken R"};
        List<String> book = new ArrayList<>(Arrays.asList(contacts));
        for (String s : searches) {
            Optional<String> hit = lookup(book, s);
            if (hit.isPresent()) System.out.println(s + ": " + hit.get());
            else System.out.println(s + ": no one");
        }
    }
}
