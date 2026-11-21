```java
class Seif {
    int sold = 0;
    int numar = 0;

    synchronized void depune(int suma) {
        sold += suma;
        numar++;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        int casieri = 4;
        int depuneri = 1000;
        int suma = 10;

        Seif seif = new Seif();
        Thread[] threaduri = new Thread[casieri];
        for (int i = 0; i < casieri; i++) {
            threaduri[i] = new Thread(() -> {
                for (int d = 0; d < depuneri; d++) {
                    seif.depune(suma);
                }
            });
            threaduri[i].start();
        }
        for (Thread t : threaduri) {
            t.join();
        }
        System.out.println("Depuneri facute: " + seif.numar);
        System.out.println("Sold: " + seif.sold);
    }
}
```
