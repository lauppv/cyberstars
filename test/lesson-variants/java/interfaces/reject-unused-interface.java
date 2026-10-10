public class Main {
    interface Printable {
        void printInfo();
    }

    static class Book {
        String title, author;
        Book(String title, String author) { this.title = title; this.author = author; }
        void printInfo() { System.out.println("Book: " + title + " by " + author); }
    }

    static class Movie {
        String title, director;
        Movie(String title, String director) { this.title = title; this.director = director; }
        void printInfo() { System.out.println("Movie: " + title + " directed by " + director); }
    }

    public static void main(String[] args) {
        String title1 = "Vice City Chronicles";
        String author1 = "Tommy Vercetti";
        String title2 = "Top Gun";
        String director2 = "Tony Scott";
        new Book(title1, author1).printInfo();
        new Movie(title2, director2).printInfo();
    }
}
