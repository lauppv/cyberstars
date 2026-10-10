public class Main {
    static void printInfo(String kind, String title, String link, String who) {
        System.out.println(kind + ": " + title + " " + link + " " + who);
    }

    public static void main(String[] args) {
        String title1 = "Vice City Chronicles";
        String author1 = "Tommy Vercetti";
        String title2 = "Top Gun";
        String director2 = "Tony Scott";
        printInfo("Book", title1, "by", author1);
        printInfo("Movie", title2, "directed by", director2);
    }
}
