import java.util.TreeMap;

class LibraryException extends Exception {
    LibraryException(String message) { super(message); }
}

class Book {
    String title;
    String borrower;
    Book(String title) { this.title = title; }
    public String toString() { return title + ": " + (borrower == null ? "on the shelf" : "with " + borrower); }
}

class Library {
    TreeMap<String, Book> shelf = new TreeMap<>();

    String borrow(String title, String name) throws LibraryException {
        Book b = shelf.get(title);
        if (b == null) throw new LibraryException("No book called " + title);
        if (b.borrower != null) throw new LibraryException(title + " is already out");
        b.borrower = name;
        return name + " took " + title;
    }

    String giveBack(String title) throws LibraryException {
        Book b = shelf.get(title);
        if (b == null) throw new LibraryException("No book called " + title);
        if (b.borrower == null) throw new LibraryException(title + " was not out");
        b.borrower = null;
        return title + " is back";
    }
}

public class Main {
    public static void main(String[] args) {
        String[] books = {"Treasure Island", "Dracula", "Moby Dick"};
        String[] requests = {"borrow:Dracula:Lance", "borrow:Dracula:Kent", "borrow:Scarface:Tommy",
            "return:Moby Dick", "return:Dracula", "borrow:Dracula:Phil"};
        Library lib = new Library();
        for (String t : books) lib.shelf.put(t, new Book(t));
        for (String r : requests) {
            String[] p = r.split(":");
            try {
                System.out.println(p.length == 3 ? lib.borrow(p[1], p[2]) : lib.giveBack(p[1]));
            } catch (LibraryException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
        System.out.println("Catalog:");
        lib.shelf.values().forEach(System.out::println);
    }
}
