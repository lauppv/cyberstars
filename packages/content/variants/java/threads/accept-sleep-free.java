class Counter extends Thread {
    private final int[] bags;
    private final int from, to;
    private int sum = 0;

    Counter(int[] bags, int from, int to) {
        this.bags = bags;
        this.from = from;
        this.to = to;
    }

    public void run() {
        int i = from;
        while (i < to) sum += bags[i++];
    }

    int sum() { return sum; }
}

public class Main {
    public static void main(String[] args) throws Exception {
        int[] bags = { 100, 250, 75, 300, 5 };
        Counter[] counters = { new Counter(bags, 0, bags.length / 2), new Counter(bags, bags.length / 2, bags.length) };
        for (Counter c : counters) c.start();
        for (Counter c : counters) c.join();
        System.out.println("First half: " + counters[0].sum());
        System.out.println("Second half: " + counters[1].sum());
        System.out.println("Total: " + (counters[0].sum() + counters[1].sum()));
    }
}
