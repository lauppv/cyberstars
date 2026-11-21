import java.util.ArrayList;

public class Main {
    public static void main(String[] args) throws InterruptedException {
        String[] words = { "Malibu", "dock", "Ocean" };
        int[] counts = new int[words.length];
        ArrayList<Thread> threads = new ArrayList<>();
        for (int i = 0; i < words.length; i++) {
            final int k = i;
            Thread t = new Thread(() -> {
                int n = 0;
                for (int j = 0; j < words[k].length(); j++) {
                    char c = Character.toLowerCase(words[k].charAt(j));
                    if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') n++;
                }
                counts[k] = n;
            });
            threads.add(t);
        }
        threads.forEach(Thread::start);
        for (Thread t : threads) t.join();
        int best = 0;
        for (int i = 0; i < words.length; i++) {
            System.out.println(words[i] + ": " + counts[i] + " vowels");
            if (counts[i] > counts[best]) best = i;
        }
        System.out.println("Most urgent: " + words[best]);
    }
}
