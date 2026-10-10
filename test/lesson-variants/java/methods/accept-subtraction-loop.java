public class Main {
    static int divide(int money, int members) {
        int count = 0;
        while (money >= members) {
            money -= members;
            count++;
        }
        return count;
    }

    public static void main(String[] args) {
        int loot = 10000;
        int crew = 4;
        System.out.printf("%d / %d = %d%n", loot, crew, divide(loot, crew));
    }
}
