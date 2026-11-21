class Counter implements Runnable {
    final String word;
    final int[] counts;
    final int index;

    Counter(String word, int[] counts, int index) {
        this.word = word;
        this.counts = counts;
        this.index = index;
    }

    public void run() {
        int count = 0;
        String lower = word.toLowerCase();
        for (int i = 0; i < lower.length(); i++) {
            char c = lower.charAt(i);
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                count++;
            }
        }
        counts[index] = count;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        String[] words = { "Malibu", "dock", "Ocean" };

        int[] counts = new int[words.length];
        Thread[] threads = new Thread[words.length];
        for (int i = 0; i < words.length; i++) {
            threads[i] = new Thread(new Counter(words[i], counts, i));
            threads[i].start();
        }
        for (Thread t : threads) {
            t.join();
        }
        int best = 0;
        for (int i = 0; i < words.length; i++) {
            System.out.println(words[i] + ": " + counts[i] + " vowels");
            if (counts[i] > counts[best]) {
                best = i;
            }
        }
        System.out.println("Most urgent: " + words[best]);
    }
}
