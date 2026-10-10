public class Main {
    public static void main(String[] args) {
        int factor = 2;
        int days = 3;
        int result = 1;
        for (int i = 0; i < days; i++) {
            result *= factor;
        }
        System.out.println(result);
    }
}
