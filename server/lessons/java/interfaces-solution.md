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
        String title1 = "Vice City Chronicles";
        String author1 = "Tommy Vercetti";
        String title2 = "Top Gun";
        String director2 = "Tony Scott";
        Book b = new Book(title1, author1);
        Movie m = new Movie(title2, director2);
        b.printInfo();
        m.printInfo();
    }
}
```
