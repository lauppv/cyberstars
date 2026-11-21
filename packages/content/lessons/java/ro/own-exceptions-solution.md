```java
class StocEpuizatException extends Exception {
    int lipsa;

    StocEpuizatException(int lipsa) {
        super("lipsesc " + lipsa);
        this.lipsa = lipsa;
    }
}

public class Main {
    static int vinde(int stoc, int cantitate) throws StocEpuizatException {
        if (cantitate > stoc) {
            throw new StocEpuizatException(cantitate - stoc);
        }
        return stoc - cantitate;
    }

    public static void main(String[] args) {
        int stoc = 10;
        int[] comenzi = {4, 8, 6, 1};

        for (int cantitate : comenzi) {
            try {
                stoc = vinde(stoc, cantitate);
                System.out.println("Am vandut " + cantitate + ", au ramas " + stoc);
            } catch (StocEpuizatException e) {
                System.out.println("Imi pare rau, " + e.getMessage());
            }
        }
        System.out.println("Stoc ramas: " + stoc);
    }
}
```
