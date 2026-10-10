public class Main {
    interface Printable {
        void printInfo();
    }

    record Book(String title, String author) implements Printable {
        public void printInfo() {
            System.out.println(String.format("Book: %s by %s", title, author));
        }
    }

    record Movie(String title, String director) implements Printable {
        public void printInfo() {
            System.out.println(String.format("Movie: %s directed by %s", title, director));
        }
    }

    public static void main(String[] args) {
        String title2 = "Top Gun";
        String director2 = "Tony Scott";
        String title1 = "Vice City Chronicles";
        String author1 = "Tommy Vercetti";
        Printable book = new Book(title1, author1);
        Printable movie = new Movie(title2, director2);
        book.printInfo();
        movie.printInfo();
    }
}
