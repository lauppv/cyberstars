public class Main {
    public static void main(String[] args) throws Exception {
        int[][] shops = { { 10, 20, 5 }, { 8, 25, 4 }, { 12, 15, 9 } };
        int[] totals = new int[shops.length];
        Thread[] threads = new Thread[shops.length];
        for (int i = 0; i < shops.length; i++) {
            int k = i;
            threads[i] = new Thread(() -> { for (int p : shops[k]) totals[k] += p; });
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        int best = 0;
        for (int i = 0; i < totals.length; i++) {
            System.out.println("Shop " + (i + 1) + ": " + totals[i]);
            if (totals[i] < totals[best]) best = i;
        }
        System.out.println("Cheapest: shop " + (best + 1));
    }
}
