import java.util.*;
import java.util.stream.*;

class NumberRange implements Iterable<Integer> {
    private final int start;
    private final int end;

    NumberRange(int start, int end) {
        this.start = start;
        this.end = end;
    }

    public Iterator<Integer> iterator() {
        return IntStream.rangeClosed(start, end).boxed().iterator();
    }

    boolean hasNext() {
        return false;
    }

    Integer next() {
        return null;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        NumberRange range = new NumberRange(Integer.parseInt(in.nextLine()), Integer.parseInt(in.nextLine()));
        for (int x : range) System.out.println(x);
    }
}
