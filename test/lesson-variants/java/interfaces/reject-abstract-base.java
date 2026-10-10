public class Main {
    static abstract class Printable {
        abstract void printInfo();
    }

    static class Book extends Printable {
        String title, author;
        Book(String title, String author) { this.title = title; this.author = author; }
        void printInfo() { System.out.println("Book: " + title + " by " + author); }
    }

    static class Movie extends Printable {
        String title, director;
        Movie(String title, String director) { this.title = title; this.director = director; }
        void printInfo() { System.out.println("Movie: " + title + " directed by " + director); }
    }

    public static void main(String[] args) {
        String title1 = "Vice City Chronicles";
        String author1 = "Tommy Vercetti";
        String title2 = "Top Gun";
        String director2 = "Tony Scott";
        Printable[] items = {new Book(title1, author1), new Movie(title2, director2)};
        for (Printable p : items) p.printInfo();
    }
}
