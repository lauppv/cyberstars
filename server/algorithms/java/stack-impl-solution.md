```java
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

class Stack {
    private final List<Integer> data = new ArrayList<>();

    void push(int value) {
        data.add(value);
    }

    // We use Integer (not int) so we can return null when the stack is empty.
    Integer pop() {
        if (data.size() == 0) {
            return null;
        }
        // LIFO: remove the top element (last position).
        return data.remove(data.size() - 1);
    }

    Integer peek() {
        if (data.size() == 0) {
            return null;
        }
        return data.get(data.size() - 1);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        Stack stack = new Stack();

        for (int i = 0; i < n; i++) {
            String cmd = sc.nextLine();

            if (cmd.equals("push")) {
                int value = Integer.parseInt(sc.nextLine());
                stack.push(value);
            } else if (cmd.equals("pop")) {
                Integer value = stack.pop();
                if (value == null) {
                    System.out.println("Empty");
                } else {
                    System.out.println(value);
                }
            } else {
                Integer value = stack.peek();
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
