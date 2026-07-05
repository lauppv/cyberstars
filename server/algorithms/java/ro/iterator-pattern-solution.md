```java
import java.util.Iterator;
import java.util.Scanner;

class IntervalNumere implements Iterable<Integer> {
    private final int inceput;
    private final int sfarsit;

    IntervalNumere(int inceput, int sfarsit) {
        this.inceput = inceput;
        this.sfarsit = sfarsit;
    }

    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<Integer>() {
            private int curent = inceput;

            @Override
            public boolean hasNext() {
                return curent <= sfarsit;
            }

            @Override
            public Integer next() {
                int valoare = curent;
                curent = curent + 1;
                return valoare;
            }
        };
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int inceput = Integer.parseInt(sc.nextLine());
        int sfarsit = Integer.parseInt(sc.nextLine());

        IntervalNumere interval = new IntervalNumere(inceput, sfarsit);

        for (int valoare : interval) {
            System.out.println(valoare);
        }
    }
}
```
