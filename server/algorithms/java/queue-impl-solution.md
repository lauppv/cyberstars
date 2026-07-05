```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Queue {
    private final List<Integer> data = new ArrayList<>();

    void enqueue(int value) {
        data.add(value);
    }

    // We use Integer (not int) so we can return null when the queue is empty.
    Integer dequeue() {
        if (data.size() == 0) {
            return null;
        }
        // FIFO: remove the front element (position 0).
        return data.remove(0);
    }

    Integer peek() {
        if (data.size() == 0) {
            return null;
        }
        return data.get(0);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Queue queue = new Queue();

        for (int i = 0; i < n; i++) {
            String cmd = sc.nextLine();

            if (cmd.equals("enqueue")) {
                int value = Integer.parseInt(sc.nextLine());
                queue.enqueue(value);
            } else if (cmd.equals("dequeue")) {
                Integer value = queue.dequeue();
                if (value == null) {
                    System.out.println("Empty");
                } else {
                    System.out.println(value);
                }
            } else {
                Integer value = queue.peek();
                if (value == null) {
                    System.out.println("Empty");
                } else {
                    System.out.println(value);
                }
            }
        }
    }
}
```
