public class Main {
    public static void main(String[] args) throws InterruptedException {
        String[] words = { "Malibu", "dock", "Ocean" };
        int[] counts = new int[words.length];
        Thread[] threads = new Thread[words.length];
        for (int i = 0; i < words.length; i++) {
            int index = i;
            threads[i] = new Thread(() -> {
                for (char c : words[index].toCharArray()) if ("aeiou".indexOf(c) >= 0) counts[index]++;
            });
            threads[i].start();
        }
        for (Thread t : threads) t.join();
        int best = 0;
        for (int i = 0; i < words.length; i++) {
            System.out.println(words[i] + ": " + counts[i] + " vowels");
            if (counts[i] > counts[best]) best = i;
        }
        System.out.println("Most urgent: " + words[best]);
    }
}
