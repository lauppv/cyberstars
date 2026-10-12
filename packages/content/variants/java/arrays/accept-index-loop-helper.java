public class Main {
    static long sum(int[] values) {
        long s = 0;
        for (int i = values.length - 1; i >= 0; i--) {
            s += values[i];
        }
        return s;
    }

    public static void main(String[] args) {
        int[] takings = { 1200, 3400, 800, 2600 };
        int k = 0;
        while (k < takings.length) {
            System.out.println(takings[k]);
            k++;
        }
        long total = sum(takings);
        System.out.println(total);
        System.out.println(total / (double) takings.length);
    }
}
