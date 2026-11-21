Time for a bigger project! The Vice City public library still keeps its books in a paper notebook, and things get lost. Let's build the library a small system: it knows every book, who has it, and it says no when a request makes no sense

This project uses a lot of what you learned since the last projects: a TreeMap, your own exception, `throw` and `throws`, `split` and `try`/`catch`. We'll build it piece by piece

---

**Step 1: The Book class**

A book has a title and the name of the person who has it. When the book is on the shelf, nobody has it, so that name is `null`

```text
class Book {
    String title;
    String borrower;

    Book(String title) {
        this.title = title;
    }
}
```

We don't set `borrower` in the constructor. A field you never set starts as `null`, which is exactly "on the shelf"

---

**Step 2: The Library class**

The library keeps its books in a `TreeMap<String, Book>`, with the title as the key. Two good things come with it: we find a book by its title at once, and the catalog is always in alphabetical order

```text
class Library {
    TreeMap<String, Book> shelf = new TreeMap<>();

    void addBook(String title) {
        shelf.put(title, new Book(title));
    }
}
```

---

**Step 3: An exception for the library**

Many requests can go wrong: a book that doesn't exist, a book that is already out. Each of these is the same kind of problem, so we give it its own exception

```text
class LibraryException extends Exception {
    LibraryException(String message) {
        super(message);
    }
}
```

It extends `Exception`, so it is checked. Every method that throws it must say `throws LibraryException`, and Java makes sure the caller deals with it

---

**Step 4: Finding a book**

Both borrowing and giving back start the same way: find the book, or complain. So that goes in one helper method

```text
Book find(String title) throws LibraryException {
    Book book = shelf.get(title);
    if (book == null) {
        throw new LibraryException("No book called " + title);
    }
    return book;
}
```

`get` gives `null` when the key is not in the map. That's our sign that the library doesn't have the book

---

**Step 5: Borrowing and giving back**

Now the two actions. Each one checks the book's state first, and throws when the request makes no sense. `return` is a word Java keeps for itself, so the second method is called `giveBack`

```text
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
```

Notice that `find` can throw too. We don't catch it here: it flies on to whoever called `borrow`, and `throws LibraryException` covers it

---

**Step 6: Reading the requests**

People hand in requests as short lines, with the parts separated by `:`

- `borrow:Dracula:Lance` means Lance wants to borrow Dracula
- `return:Dracula` means someone brings Dracula back

`split(":")` cuts a request into its parts, and the first part says what to do

```java
public class Main {
    public static void main(String[] args) {
        String request = "borrow:Moby Dick:Phil";
        String[] parts = request.split(":");

        System.out.println(parts[0]);
        System.out.println(parts[1]);
        System.out.println(parts[2]);
    }
}
```

Output

```text
borrow
Moby Dick
Phil
```

---

**Step 7: Putting it together**

For each request, call the right method inside a `try`. If it works, print what happened. If the library throws, print why it said no

```text
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
```

One bad request doesn't stop the others, because the `try` is inside the loop

---

## Mission: The Vice City Library

Build the library from the steps above, then run a day of requests through it

The titles of the books are in a `String[] books` array, and the requests in a `String[] requests` array. A request is `borrow:title:name` or `return:title`. Write the classes `Book`, `Library` (with the methods `borrow` and `giveBack`) and `LibraryException`. For each request, print:

- `name took title` when a borrow works
- `title is back` when a return works
- `Refused: ` and the reason when it doesn't. The reasons are `No book called title`, `title is already out` and `title was not out`

At the end, print `Catalog:` and then every book in alphabetical order, as `title: on the shelf` or `title: with name`

**Example**

```text
Lance took Dracula
Refused: Dracula is already out
Refused: No book called Scarface
Refused: Moby Dick was not out
Dracula is back
Phil took Dracula
Catalog:
Dracula: with Phil
Moby Dick: on the shelf
Treasure Island: on the shelf
```

**Example**

```text
Catalog:
Hamlet: on the shelf
```
