import java.util.*;

class Queue {
    private final ArrayDeque<Integer> items = new ArrayDeque<>();

    void enqueue(int x) {
        items.addLast(x);
    }

    Integer dequeue() {
        return items.pollFirst();
    }

    Integer peek() {
        return items.peekFirst();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        Queue q = new Queue();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            if (cmd.equals("enqueue")) {
                q.enqueue(Integer.parseInt(in.nextLine()));
            } else {
                Integer v = cmd.equals("dequeue") ? q.dequeue() : q.peek();
                System.out.println(v == null ? "Empty" : v);
            }
        }
    }
}
