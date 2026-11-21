public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Ken" };
        int[] cash = { 1500000, 25000, 980 };
        int sum = 0;
        for (int i = 0; i < cash.length; i++) {
            sum = sum + cash[i];
            System.out.printf("%-10s%,12d%n", names[i], cash[i]);
        }
        System.out.printf("%-10s%,12d%n", "TOTAL", sum);
    }
}
