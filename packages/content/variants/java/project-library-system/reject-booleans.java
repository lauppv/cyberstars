import java.util.TreeMap;

class Book {
    String title;
    String borrower;
    Book(String title) { this.title = title; }
}

class Library {
    TreeMap<String, Book> shelf = new TreeMap<>();
    String borrow(String t, String n) {
        Book b = shelf.get(t);
        if (b == null) return "No book called " + t;
        if (b.borrower != null) return t + " is already out";
        b.borrower = n;
        return null;
    }
    String giveBack(String t) {
        Book b = shelf.get(t);
        if (b == null) return "No book called " + t;
        if (b.borrower == null) return t + " was not out";
        b.borrower = null;
        return null;
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
            String err = p[0].equals("borrow") ? lib.borrow(p[1], p[2]) : lib.giveBack(p[1]);
            if (err != null) System.out.println("Refused: " + err);
            else if (p[0].equals("borrow")) System.out.println(p[2] + " took " + p[1]);
            else System.out.println(p[1] + " is back");
        }
        System.out.println("Catalog:");
        for (Book b : lib.shelf.values())
            System.out.println(b.title + ": " + (b.borrower == null ? "on the shelf" : "with " + b.borrower));
    }
}
