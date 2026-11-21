import java.util.TreeMap;

class LibraryException extends Exception {
    LibraryException(String message) { super(message); }
}

class Book {
    String title;
    String borrower;
    Book(String title) { this.title = title; }
}

class Library {
    TreeMap<String, Book> shelf = new TreeMap<>();
    Book find(String t) throws LibraryException {
        Book b = shelf.get(t);
        if (b == null) throw new LibraryException("No book called " + t);
        return b;
    }
    void borrow(String t, String n) throws LibraryException {
        Book b = find(t);
        if (b.borrower != null) throw new LibraryException(t + " is already out");
        b.borrower = n;
    }
    void giveBack(String t) throws LibraryException {
        find(t).borrower = null;
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
                if (p[0].equals("borrow")) { lib.borrow(p[1], p[2]); System.out.println(p[2] + " took " + p[1]); }
                else { lib.giveBack(p[1]); System.out.println(p[1] + " is back"); }
            } catch (LibraryException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }
        System.out.println("Catalog:");
        for (Book b : lib.shelf.values())
            System.out.println(b.title + ": " + (b.borrower == null ? "on the shelf" : "with " + b.borrower));
    }
}
