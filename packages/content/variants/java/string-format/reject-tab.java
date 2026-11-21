public class Main {
    public static void main(String[] args) {
        String[] names = { "Tommy", "Lance", "Ken" };
        int[] cash = { 1500000, 25000, 980 };
        int total = 0;
        for (int i = 0; i < names.length; i++) {
            System.out.println(names[i] + "\t" + String.format("%,d", cash[i]));
            total += cash[i];
        }
        System.out.println("TOTAL\t" + String.format("%,d", total));
    }
}
