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
            private int current = start;

            @Override
            public boolean hasNext() {
                return current <= end;
            }

            @Override
            public Integer next() {
                int value = current;
                current = current + 1;
                return value;
            }
        };
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int start = Integer.parseInt(sc.nextLine());
        int end = Integer.parseInt(sc.nextLine());

        NumberRange range = new NumberRange(start, end);

        for (int value : range) {
            System.out.println(value);
        }
    }
}
```
