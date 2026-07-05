```java
import java.util.Scanner;

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
        Node node = new Node(value);

        // Empty list: the new node becomes the head.
        if (head == null) {
            head = node;
            return;
        }

        // Walk to the last node and link the new node after it.
        Node cur = head;
        while (cur.next != null) {
            cur = cur.next;
        }
        cur.next = node;
    }

    boolean remove(int value) {
        if (head == null) {
            return false;
        }

        // Special case: the value to remove is the head itself.
        if (head.value == value) {
            head = head.next;
            return true;
        }

        // Look for a node whose next is a node with the given value.
        // When we find it, skip over it: cur.next = cur.next.next.
        Node cur = head;
        while (cur.next != null) {
            if (cur.next.value == value) {
                cur.next = cur.next.next;
                return true;
            }
            cur = cur.next;
        }

        return false;
    }

    String print() {
        if (head == null) {
            return "Empty";
        }

        String result = "";
        Node cur = head;
        while (cur != null) {
            if (result.length() > 0) {
                result = result + " -> ";
            }
            result = result + cur.value;
            cur = cur.next;
        }
        return result;
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        int n = Integer.parseInt(sc.nextLine());

        LinkedList list = new LinkedList();

        for (int i = 0; i < n; i++) {
            String cmd = sc.nextLine();

            if (cmd.equals("add")) {
                int value = Integer.parseInt(sc.nextLine());
                list.add(value);
            } else if (cmd.equals("remove")) {
                int value = Integer.parseInt(sc.nextLine());
                if (!list.remove(value)) {
                    System.out.println("Not found");
                }
            } else {
                System.out.println(list.print());
            }
        }
    }
}
```
