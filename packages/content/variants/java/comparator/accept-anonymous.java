import java.util.*;

public class Main {
    static class Racer {
        String n; int t;
        Racer(String n, int t) { this.n = n; this.t = t; }
        public String toString() { return n + " - " + t + " s"; }
    }

    public static void main(String[] args) {
        String[] drivers = {"Tommy", "Lance", "Phil", "Candy"};
        int[] times = {61, 58, 75, 61};
        List<Racer> all = new ArrayList<Racer>();
        for (int i = 0; i < drivers.length; i++) all.add(new Racer(drivers[i], times[i]));
        Collections.sort(all, new Comparator<Racer>() {
            public int compare(Racer a, Racer b) { return Integer.compare(a.t, b.t); }
        });
        System.out.println("By time:");
        for (Racer r : all) System.out.println(r);
        Collections.sort(all, new Comparator<Racer>() {
            public int compare(Racer a, Racer b) { return a.n.compareTo(b.n); }
        });
        System.out.println("By name:");
        for (Racer r : all) System.out.println(r);
    }
}
