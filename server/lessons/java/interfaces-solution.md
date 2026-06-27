```java
interface Printable {
    void printInfo();
}

class Book implements Printable {
    String title, author;
    Book(String title, String author) {
        this.title = title;
        this.author = author;
    }
    @Override
    public void printInfo() {
        System.out.println("Book: " + title + " by " + author);
    }
}

class Movie implements Printable {
    String title, director;
    Movie(String title, String director) {
        this.title = title;
        this.director = director;
    }
    @Override
    public void printInfo() {
        System.out.println("Movie: " + title + " directed by " + director);
    }
}

public class Main {
    public static void main(String[] args) {
        Book b = new Book("Vice City Chronicles", "Tommy Vercetti");
        Movie m = new Movie("Top Gun", "Tony Scott");
        b.printInfo();
        m.printInfo();
    }
}
```
