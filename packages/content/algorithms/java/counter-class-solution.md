```java
import java.util.Scanner;

class Counter {
    private int value = 0;

    void increment() {
        value = value + 1;
    }

    void decrement() {
        value = value - 1;
    }

    int getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Counter counter = new Counter();

        for (int i = 0; i < n; i++) {
            String cmd = sc.nextLine();

            if (cmd.equals("inc")) {
                counter.increment();
            } else if (cmd.equals("dec")) {
                counter.decrement();
            } else {
                System.out.println(counter.getValue());
            }
        }
    }
}
```
