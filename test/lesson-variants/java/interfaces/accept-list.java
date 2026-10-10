import java.util.ArrayList;
import java.util.List;

interface Printable {
    void printInfo();
}

class Book implements Printable {
    private final String t, a;
    Book(String t, String a) { this.t = t; this.a = a; }
    public void printInfo() { System.out.println("Book: " + t + " by " + a); }
}

class Movie implements Printable {
    private final String t, d;
    Movie(String t, String d) { this.t = t; this.d = d; }
    public void printInfo() { System.out.println("Movie: " + t + " directed by " + d); }
}

public class Main {
    public static void main(String[] args) {
        String title1 = "Vice City Chronicles";
        String author1 = "Tommy Vercetti";
        String title2 = "Top Gun";
        String director2 = "Tony Scott";
        List<Printable> catalog = new ArrayList<>();
        catalog.add(new Book(title1, author1));
        catalog.add(new Movie(title2, director2));
        for (Printable p : catalog) p.printInfo();
    }
}
