import java.util.*;

class Stack {
    private final ArrayList<Integer> items = new ArrayList<>();

    boolean isEmpty() {
        return items.isEmpty();
    }

    void push(int x) {
        items.add(x);
    }

    int pop() {
        return items.remove(items.size() - 1);
    }

    int peek() {
        return items.get(items.size() - 1);
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int commands = Integer.parseInt(in.nextLine().trim());
        Stack s = new Stack();
        StringBuilder out = new StringBuilder();
        while (commands-- > 0) {
            String cmd = in.nextLine().trim();
            if (cmd.equals("push")) {
                s.push(Integer.parseInt(in.nextLine().trim()));
            } else if (s.isEmpty()) {
                out.append("Empty\n");
            } else if (cmd.equals("pop")) {
                out.append(s.pop()).append('\n');
            } else {
                out.append(s.peek()).append('\n');
            }
        }
        System.out.print(out);
    }
}
