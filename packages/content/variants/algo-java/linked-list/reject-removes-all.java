import java.util.*;

class Node {
    int value;
    Node next;

    Node(int value) {
        this.value = value;
    }
}

class LinkedList {
    private Node head;

    void add(int value) {
        Node fresh = new Node(value);
        if (head == null) {
            head = fresh;
            return;
        }
        Node at = head;
        while (at.next != null) at = at.next;
        at.next = fresh;
    }

    boolean remove(int value) {
        boolean found = false;
        while (head != null && head.value == value) {
            head = head.next;
            found = true;
        }
        for (Node at = head; at != null && at.next != null; ) {
            if (at.next.value == value) {
                at.next = at.next.next;
                found = true;
            } else {
                at = at.next;
            }
        }
        return found;
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
