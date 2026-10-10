interface Printable {
    void printInfo();
}

class Book implements Printable {
    String title, author;
    Book(String title, String author) { this.title = title; this.author = author; }
    public void printInfo() { System.out.println("Book: " + author + " by " + title); }
}

class Movie implements Printable {
    String title, director;
    Movie(String title, String director) { this.title = title; this.director = director; }
    public void printInfo() { System.out.println("Movie: " + title + " directed by " + director); }
}

public class Main {
    public static void main(String[] args) {
        String title1 = "Tommy Vercetti";
        String author1 = "Vice City Chronicles";
        String title2 = "Top Gun";
        String director2 = "Tony Scott";
        new Book(title1, author1).printInfo();
        new Movie(title2, director2).printInfo();
    }
}
