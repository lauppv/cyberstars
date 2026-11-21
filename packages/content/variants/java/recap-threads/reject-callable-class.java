import java.util.ArrayList;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

class Stash {
    int total = 0;
    int count = 0;

    synchronized void add(int amount) {
        total += amount;
        count++;
    }
}

class Haul implements Callable<Integer> {
    final int[] jobs;
    final Stash stash;

    Haul(int[] jobs, Stash stash) {
        this.jobs = jobs;
        this.stash = stash;
    }

    public Integer call() {
        int mine = 0;
        for (int amount : jobs) {
            stash.add(amount);
            mine += amount;
        }
        return mine;
    }
}

public class Main {
    public static void main(String[] args) throws Exception {
        String[] crews = { "Tommy", "Lance", "Ken" };
        int[][] hauls = { { 500, 200 }, { 100 }, { 300, 300, 100 } };

        Stash stash = new Stash();
        ExecutorService pool = Executors.newFixedThreadPool(2);
        ArrayList<Future<Integer>> results = new ArrayList<>();
        for (int[] jobs : hauls) {
            results.add(pool.submit(new Haul(jobs, stash)));
        }
        int best = 0;
        int bestTotal = 0;
        for (int i = 0; i < crews.length; i++) {
            int total = results.get(i).get();
            System.out.println(crews[i] + ": " + total);
            if (i == 0 || total > bestTotal) {
                best = i;
                bestTotal = total;
            }
        }
        pool.shutdown();
        System.out.println("Stash: " + stash.total + " from " + stash.count + " hauls");
        System.out.println("Best crew: " + crews[best]);
    }
}
