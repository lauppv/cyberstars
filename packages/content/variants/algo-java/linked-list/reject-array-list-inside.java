import java.util.*;

class Node {
    int value;
    Node next;
}

class LinkedList {
    private final ArrayList<Integer> items = new ArrayList<>();

    void add(int value) {
        items.add(value);
    }

    boolean remove(int value) {
        return items.remove(Integer.valueOf(value));
    }

    String print() {
        if (items.isEmpty()) return "Empty";
        StringJoiner parts = new StringJoiner(" -> ");
        for (int v : items) parts.add(String.valueOf(v));
        return parts.toString();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        int n = Integer.parseInt(in.nextLine());
        LinkedList list = new LinkedList();
        for (int i = 0; i < n; i++) {
            String cmd = in.nextLine();
            if (cmd.equals("add")) {
                list.add(Integer.parseInt(in.nextLine()));
            } else if (cmd.equals("remove")) {
                if (!list.remove(Integer.parseInt(in.nextLine()))) System.out.println("Not found");
            } else {
                System.out.println(list.print());
            }
        }
    }
}
