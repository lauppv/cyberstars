import java.util.*;

class Counter {
    private long value;

    void increment() {
        value++;
    }

    void decrement() {
        value--;
    }

    long getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = in.nextInt();
        Counter c = new Counter();
        StringBuilder out = new StringBuilder();
        while (n-- > 0) {
            switch (in.next()) {
                case "inc" -> c.increment();
                case "dec" -> c.decrement();
                default -> out.append(c.getValue()).append('\n');
            }
        }
        System.out.print(out);
    }
}
