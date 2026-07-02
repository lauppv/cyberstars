```java
import java.util.Scanner;

class Counter {
    private int value = 0;

    void increment() {
        value++;
    }

    void decrement() {
        value--;
    }

    int getValue() {
        return value;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Counter counter = new Counter();
        for (int i = 0; i < n; i++) {
            String cmd = sc.nextLine().trim();
            switch (cmd) {
                case "inc":
                    counter.increment();
                    break;
                case "dec":
                    counter.decrement();
                    break;
                case "get":
                    System.out.println(counter.getValue());
                    break;
            }
        }
    }
}
```
