```java
public class Main {
    static <T> int numara(T[] lucruri, T cautat) {
        int gasite = 0;
        for (T lucru : lucruri) {
            if (lucru.equals(cautat)) {
                gasite++;
            }
        }
        return gasite;
    }

    static <T> T ultimulDin(T[] lucruri) {
        return lucruri[lucruri.length - 1];
    }

    public static void main(String[] args) {
        String[] cuvinte = { "bani", "pistol", "bani" };
        String cuvant = "bani";
        Integer[] numere = { 1000, 5, 1000, 1000 };
        Integer numar = 1000;

        System.out.println(cuvant + ": de " + numara(cuvinte, cuvant) + " ori");
        System.out.println(numar + ": de " + numara(numere, numar) + " ori");
        System.out.println("Ultimul cuvant: " + ultimulDin(cuvinte));
        System.out.println("Ultimul numar: " + ultimulDin(numere));
    }
}
```
