public class Main {
    public static void main(String[] args) {
        int[] takings = { 1200, 3400, 800, 2600 };
        int total = 0;
        for (int i = 0; i < takings.length - 1; i++) {
            System.out.println(takings[i]);
            total += takings[i];
        }
        System.out.println(total);
        System.out.println((double) total / takings.length);
    }
}
