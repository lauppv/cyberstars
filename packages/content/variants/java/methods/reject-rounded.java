public class Main {
    static long share(int loot, int crew) {
        return Math.round((double) loot / crew);
    }

    public static void main(String[] args) {
        int loot = 10000;
        int crew = 4;
        System.out.println(loot + " / " + crew + " = " + share(loot, crew));
    }
}
