public class Main {
    static int shareOf(int total, int people) {
        int share = total / people;
        return share;
    }

    public static void main(String[] args) {
        int loot = 10000;
        int crew = 4;
        int each = shareOf(loot, crew);
        System.out.println(loot + " / " + crew + " = " + each);
    }
}
