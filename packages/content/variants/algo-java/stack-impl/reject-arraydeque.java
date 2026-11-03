import java.util.*;

class Stack {
    private final ArrayDeque<Integer> data = new ArrayDeque<>();

    void push(int x) {
        data.push(x);
    }

    Integer pop() {
        return data.poll();
    }

    Integer peek() {
        return data.peek();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        Stack s = new Stack();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            if (cmd.equals("push")) {
                s.push(Integer.parseInt(in.nextLine()));
            } else {
                Integer v = cmd.equals("pop") ? s.pop() : s.peek();
                System.out.println(v == null ? "Empty" : v);
            }
        }
    }
}
