```java
import java.util.TreeMap;

class LibraryException extends Exception {
    LibraryException(String message) {
        super(message);
    }
}

class Book {
    String title;
    String borrower;

    Book(String title) {
        this.title = title;
    }
}

class Library {
    TreeMap<String, Book> shelf = new TreeMap<>();

    void addBook(String title) {
        shelf.put(title, new Book(title));
    }

    Book find(String title) throws LibraryException {
        Book book = shelf.get(title);
        if (book == null) {
            throw new LibraryException("No book called " + title);
        }
        return book;
    }

    void borrow(String title, String name) throws LibraryException {
        Book book = find(title);
        if (book.borrower != null) {
            throw new LibraryException(title + " is already out");
        }
        book.borrower = name;
    }

    void giveBack(String title) throws LibraryException {
        Book book = find(title);
        if (book.borrower == null) {
            throw new LibraryException(title + " was not out");
        }
        book.borrower = null;
    }

    void printCatalog() {
        for (Book book : shelf.values()) {
            if (book.borrower == null) {
                System.out.println(book.title + ": on the shelf");
            } else {
                System.out.println(book.title + ": with " + book.borrower);
            }
        }
    }
}

public class Main {
    public static void main(String[] args) {
        String[] books = {"Treasure Island", "Dracula", "Moby Dick"};
        String[] requests = {
            "borrow:Dracula:Lance",
            "borrow:Dracula:Kent",
            "borrow:Scarface:Tommy",
            "return:Moby Dick",
            "return:Dracula",
            "borrow:Dracula:Phil"
        };

        Library library = new Library();
        for (String title : books) {
            library.addBook(title);
        }

        for (String request : requests) {
            String[] parts = request.split(":");
            try {
                if (parts[0].equals("borrow")) {
                    library.borrow(parts[1], parts[2]);
                    System.out.println(parts[2] + " took " + parts[1]);
                } else {
                    library.giveBack(parts[1]);
                    System.out.println(parts[1] + " is back");
                }
            } catch (LibraryException e) {
                System.out.println("Refused: " + e.getMessage());
            }
        }

        System.out.println("Catalog:");
        library.printCatalog();
    }
}
```
