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
                return current++;
            }
        };
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] parts = sc.nextLine().trim().split("\\s+");
        int start = Integer.parseInt(parts[0]);
        int end = Integer.parseInt(parts[1]);
        NumberRange range = new NumberRange(start, end);
        for (int value : range) {
            System.out.println(value);
        }
    }
}
```
