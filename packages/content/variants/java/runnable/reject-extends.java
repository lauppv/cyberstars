public class Main {
    static class Counter extends Thread {
        String word; int count;
        Counter(String word) { this.word = word; }
        public void run() {
            for (char c : word.toLowerCase().toCharArray()) if ("aeiou".indexOf(c) >= 0) count++;
        }
    }

    public static void main(String[] args) throws InterruptedException {
        String[] words = { "Malibu", "dock", "Ocean" };
        Counter[] cs = new Counter[words.length];
        for (int i = 0; i < words.length; i++) { cs[i] = new Counter(words[i]); cs[i].start(); }
        Runnable nothing = () -> {};
        for (Counter c : cs) c.join();
        int best = 0;
        for (int i = 0; i < words.length; i++) {
            System.out.println(words[i] + ": " + cs[i].count + " vowels");
            if (cs[i].count > cs[best].count) best = i;
        }
        System.out.println("Most urgent: " + words[best]);
    }
}
