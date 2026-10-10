public class Main {
    public static int growth(int factor, int days) {
        return (int) Math.pow(factor, days);
    }

    public static void main(String[] args) {
        int factor = 2;
        int days = 3;
        System.out.println(growth(factor, days));
    }
}
