```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Queue {
    private final List<Integer> data = new ArrayList<>();

    void enqueue(int value) {
        data.add(value);
    }

    Integer dequeue() {
        if (data.isEmpty()) {
            return null;
        }
        return data.remove(0);
    }

    Integer peek() {
        if (data.isEmpty()) {
            return null;
        }
        return data.get(0);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Queue queue = new Queue();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split("\\s+");
            switch (parts[0]) {
                case "enqueue":
                    queue.enqueue(Integer.parseInt(parts[1]));
                    break;
                case "dequeue": {
                    Integer value = queue.dequeue();
                    System.out.println(value == null ? "Empty" : value.toString());
                    break;
                }
                case "peek": {
                    Integer value = queue.peek();
                    System.out.println(value == null ? "Empty" : value.toString());
                    break;
                }
            }
        }
    }
}
```
