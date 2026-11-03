import java.util.*;

class Queue {
    private final ArrayList<Integer> items = new ArrayList<>();

    void enqueue(int x) {
        items.add(x);
    }

    Integer dequeue() {
        return items.isEmpty() ? null : items.remove(items.size() - 1);
    }

    Integer peek() {
        return items.isEmpty() ? null : items.get(items.size() - 1);
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
