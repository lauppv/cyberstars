```java
public class Main {
    static int vocale(String cuvant) {
        int numar = 0;
        String mic = cuvant.toLowerCase();
        for (int i = 0; i < mic.length(); i++) {
            char c = mic.charAt(i);
            if (c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u') {
                numar++;
            }
        }
        return numar;
    }

    public static void main(String[] args) throws InterruptedException {
        String[] cuvinte = { "Malibu", "doc", "Ocean" };

        int[] numere = new int[cuvinte.length];
        Thread[] threaduri = new Thread[cuvinte.length];
        for (int i = 0; i < cuvinte.length; i++) {
            int index = i;
            threaduri[i] = new Thread(() -> numere[index] = vocale(cuvinte[index]));
            threaduri[i].start();
        }
        for (Thread t : threaduri) {
            t.join();
        }
        int maxim = 0;
        for (int i = 0; i < cuvinte.length; i++) {
            System.out.println(cuvinte[i] + ": " + numere[i] + " vocale");
            if (numere[i] > numere[maxim]) {
                maxim = i;
            }
        }
        System.out.println("Cel mai urgent: " + cuvinte[maxim]);
    }
}
```
