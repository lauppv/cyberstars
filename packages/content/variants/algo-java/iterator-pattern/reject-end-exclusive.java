import java.util.*;

class NumberRange implements Iterable<Integer> {
    private final int start;
    private final int end;

    NumberRange(int start, int end) {
        this.start = start;
        this.end = end;
    }

    public Iterator<Integer> iterator() {
        return new Iterator<Integer>() {
            private int current = start;

            public boolean hasNext() {
                return current < end;
            }

            public Integer next() {
                return current++;
            }
        };
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        NumberRange range = new NumberRange(Integer.parseInt(in.nextLine()), Integer.parseInt(in.nextLine()));
        for (int x : range) System.out.println(x);
    }
}
