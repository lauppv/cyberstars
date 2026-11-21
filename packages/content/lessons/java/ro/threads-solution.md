```java
class Numarator extends Thread {
    int[] saci;
    int de;
    int pana;
    int suma;

    Numarator(int[] saci, int de, int pana) {
        this.saci = saci;
        this.de = de;
        this.pana = pana;
    }

    @Override
    public void run() {
        for (int i = de; i < pana; i++) {
            suma += saci[i];
        }
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        int[] saci = { 100, 250, 75, 300, 5 };

        int mijloc = saci.length / 2;
        Numarator primul = new Numarator(saci, 0, mijloc);
        Numarator alDoilea = new Numarator(saci, mijloc, saci.length);
        primul.start();
        alDoilea.start();
        primul.join();
        alDoilea.join();
        System.out.println("Prima jumatate: " + primul.suma);
        System.out.println("A doua jumatate: " + alDoilea.suma);
        System.out.println("Total: " + (primul.suma + alDoilea.suma));
    }
}
```
