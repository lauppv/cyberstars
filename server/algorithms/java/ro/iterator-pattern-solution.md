```java
import java.util.Iterator;
import java.util.Scanner;

class NumberRange implements Iterable<Integer> {
    private final int start;
    private final int end;

    NumberRange(int start, int end) {
        this.start = start;
        this.end = end;
    }

    @Override
    public Iterator<Integer> iterator() {
        return new Iterator<Integer>() {
            private int curent = start;

            @Override
            public boolean hasNext() {
                return curent <= end;
            }

            @Override
            public Integer next() {
                return curent++;
            }
        };
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parti = sc.nextLine().trim().split("\\s+");
        int start = Integer.parseInt(parti[0]);
        int end = Integer.parseInt(parti[1]);
        NumberRange interval = new NumberRange(start, end);
        for (int valoare : interval) {
            System.out.println(valoare);
        }
    }
}
```
