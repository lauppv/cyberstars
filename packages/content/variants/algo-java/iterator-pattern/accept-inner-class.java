import java.util.*;

class NumberRange implements Iterable<Integer> {
    private final int from;
    private final int to;

    NumberRange(int from, int to) {
        this.from = from;
        this.to = to;
    }

    private class Walker implements Iterator<Integer> {
        private long at = from;

        public boolean hasNext() {
            return at <= to;
        }

        public Integer next() {
            return (int) at++;
        }
    }

    public Iterator<Integer> iterator() {
        return new Walker();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        NumberRange range = new NumberRange(in.nextInt(), in.nextInt());
        StringBuilder out = new StringBuilder();
        for (int x : range) out.append(x).append('\n');
        System.out.print(out);
    }
}
