import java.util.*;

public class Main {
    static class LibraryException extends Exception {
        LibraryException(String m) { super(m); }
    }

    static class Book {
        final String title;
        String holder = null;
        Book(String title) { this.title = title; }
    }

    static class Library {
        private final Map<String, Book> books = new HashMap<>();
        void add(String t) { books.putIfAbsent(t, new Book(t)); }
        private Book get(String t) throws LibraryException {
            if (!books.containsKey(t)) throw new LibraryException("No book called " + t);
            return books.get(t);
        }
        void borrow(String t, String who) throws LibraryException {
            Book b = get(t);
            if (b.holder != null) throw new LibraryException(t + " is already out");
            b.holder = who;
        }
        void giveBack(String t) throws LibraryException {
            Book b = get(t);
            if (b.holder == null) throw new LibraryException(t + " was not out");
            b.holder = null;
        }
        void catalog() {
            List<String> titles = new ArrayList<>(books.keySet());
            Collections.sort(titles);
            for (String t : titles) {
                Book b = books.get(t);
                System.out.println(t + ": " + (b.holder == null ? "on the shelf" : "with " + b.holder));
            }
        }
    }

    public static void main(String[] args) {
        String[] books = {"Treasure Island", "Dracula", "Moby Dick"};
        String[] requests = {"borrow:Dracula:Lance", "borrow:Dracula:Kent", "borrow:Scarface:Tommy",
            "return:Moby Dick", "return:Dracula", "borrow:Dracula:Phil"};
        Library lib = new Library();
        Arrays.stream(books).forEach(lib::add);
        for (String r : requests) {
            String[] p = r.split(":");
            try {
                switch (p[0]) {
                    case "borrow" -> { lib.borrow(p[1], p[2]); System.out.println(p[2] + " took " + p[1]); }
                    default -> { lib.giveBack(p[1]); System.out.println(p[1] + " is back"); }
                }
            } catch (LibraryException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
        System.out.println("Catalog:");
        lib.catalog();
    }
}
