import java.util.*;

class Node {
    final int value;
    Node next;

    Node(int value) {
        this.value = value;
    }
}

class LinkedList {
    private Node head;
    private Node tail;

    void add(int value) {
        Node fresh = new Node(value);
        if (head == null) head = fresh;
        else tail.next = fresh;
        tail = fresh;
    }

    boolean remove(int value) {
        Node before = null;
        for (Node at = head; at != null; before = at, at = at.next) {
            if (at.value != value) continue;
            if (before == null) head = at.next;
            else before.next = at.next;
            if (at == tail) tail = before;
            return true;
        }
        return false;
    }

    String print() {
        if (head == null) return "Empty";
        StringJoiner parts = new StringJoiner(" -> ");
        for (Node at = head; at != null; at = at.next) parts.add(String.valueOf(at.value));
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
