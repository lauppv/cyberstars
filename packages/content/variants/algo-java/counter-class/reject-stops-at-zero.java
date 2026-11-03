import java.util.*;

class Counter {
    private int value;

    void increment() {
        value++;
    }

    void decrement() {
        if (value > 0) value--;
    }

    int getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        Counter c = new Counter();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            if (cmd.equals("inc")) c.increment();
            else if (cmd.equals("dec")) c.decrement();
            else System.out.println(c.getValue());
        }
    }
}
