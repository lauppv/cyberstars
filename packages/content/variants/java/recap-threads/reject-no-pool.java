class Stash {
    int total = 0, count = 0;
    synchronized void add(int amount) { total += amount; count++; }
}

public class Main {
    public static void main(String[] args) throws Exception {
        String[] crews = { "Tommy", "Lance", "Ken" };
        int[][] hauls = { { 500, 200 }, { 100 }, { 300, 300, 100 } };
        Stash stash = new Stash();
        int[] totals = new int[crews.length];
        Thread[] threads = new Thread[crews.length];
        for (int i = 0; i < crews.length; i++) {
            int k = i;
            threads[i] = new Thread(() -> { for (int a : hauls[k]) { stash.add(a); totals[k] += a; } });
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        int best = 0;
        for (int i = 0; i < crews.length; i++) {
            System.out.println(crews[i] + ": " + totals[i]);
            if (totals[i] > totals[best]) best = i;
        }
        System.out.println("Stash: " + stash.total + " from " + stash.count + " hauls");
        System.out.println("Best crew: " + crews[best]);
    }
}
