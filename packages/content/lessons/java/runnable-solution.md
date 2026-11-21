```java
public class Main {
    static int vowels(String word) {
        int count = 0;
        String lower = word.toLowerCase();
        for (int i = 0; i < lower.length(); i++) {
            char c = lower.charAt(i);
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                count++;
            }
        }
        return count;
    }

    public static void main(String[] args) throws InterruptedException {
        String[] words = { "Malibu", "dock", "Ocean" };

        int[] counts = new int[words.length];
        Thread[] threads = new Thread[words.length];
        for (int i = 0; i < words.length; i++) {
            int index = i;
            threads[i] = new Thread(() -> counts[index] = vowels(words[index]));
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
```
