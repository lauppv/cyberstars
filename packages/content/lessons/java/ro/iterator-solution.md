```java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        int[] oferte = {5000, 9000, 1000, 12000, 7500, 2000};
        int minim = 7000;

        ArrayList<Integer> lista = new ArrayList<>();
        for (int oferta : oferte) {
            lista.add(oferta);
        }

        int scoase = 0;
        Iterator<Integer> it = lista.iterator();
        while (it.hasNext()) {
            if (it.next() < minim) {
                it.remove();
                scoase++;
            }
        }
        System.out.println("Pastrate: " + lista);
        System.out.println("Scoase: " + scoase);
    }
}
```
