public class Main {
    public static int empire(int k, int t) {
        int value = 1;
        for (int day = 1; day <= t; day++) {
            value = value * k;
        }
        return value;
    }

    public static void main(String[] args) {
        int factor = 2;
        int days = 3;
        System.out.print(empire(factor, days) + "\n");
    }
}
