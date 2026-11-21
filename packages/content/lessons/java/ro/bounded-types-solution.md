```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    static <T extends Comparable<T>> T celMaiBun(ArrayList<T> lucruri) {
        T maxim = lucruri.get(0);
        for (T lucru : lucruri) {
            if (lucru.compareTo(maxim) > 0) {
                maxim = lucru;
            }
        }
        return maxim;
    }

    static double total(ArrayList<? extends Number> valori) {
        double suma = 0;
        for (Number v : valori) {
            suma += v.doubleValue();
        }
        return suma;
    }

    public static void main(String[] args) {
        ArrayList<String> nume = new ArrayList<>(List.of("Tommy", "Ken", "Lance"));
        ArrayList<Integer> scoruri = new ArrayList<>(List.of(120, 85, 40));
        ArrayList<Double> timpi = new ArrayList<>(List.of(61.5, 58.25));

        System.out.println("Ultimul nume: " + celMaiBun(nume));
        System.out.println("Cel mai mare scor: " + celMaiBun(scoruri));
        System.out.println("Totalul scorurilor: " + total(scoruri));
        System.out.println("Totalul timpilor: " + total(timpi));
    }
}
```
