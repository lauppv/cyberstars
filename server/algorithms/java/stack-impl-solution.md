```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Stack {
    private final List<Integer> data = new ArrayList<>();

    void push(int value) {
        data.add(value);
    }

    Integer pop() {
        if (data.isEmpty()) {
            return null;
        }
        return data.remove(data.size() - 1);
    }

    Integer peek() {
        if (data.isEmpty()) {
            return null;
        }
        return data.get(data.size() - 1);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        Stack stack = new Stack();
        for (int i = 0; i < n; i++) {
            String[] parts = sc.nextLine().trim().split("\\s+");
            switch (parts[0]) {
                case "push":
                    stack.push(Integer.parseInt(parts[1]));
                    break;
                case "pop": {
                    Integer value = stack.pop();
                    System.out.println(value == null ? "Empty" : value.toString());
                    break;
                }
                case "peek": {
                    Integer value = stack.peek();
                    System.out.println(value == null ? "Empty" : value.toString());
                    break;
                }
            }
        }
    }
}
```
