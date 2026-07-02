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
        if (head == null) {
            head = node;
            return;
        }
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
        if (head.value == value) {
            head = head.next;
            return true;
        }
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
        StringBuilder sb = new StringBuilder();
        Node cur = head;
        while (cur != null) {
            if (sb.length() > 0) {
                sb.append(" -> ");
            }
            sb.append(cur.value);
            cur = cur.next;
        }
        return sb.toString();
    }
}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = Integer.parseInt(sc.nextLine().trim());
        LinkedList list = new LinkedList();
        for (int i = 0; i < n; i++) {
            String line = sc.nextLine().trim();
            String[] parts = line.split("\\s+");
            switch (parts[0]) {
                case "add":
                    list.add(Integer.parseInt(parts[1]));
                    break;
                case "remove":
                    int value = Integer.parseInt(parts[1]);
                    if (!list.remove(value)) {
                        System.out.println("Not found");
                    }
                    break;
                case "print":
                    System.out.println(list.print());
                    break;
            }
        }
    }
}
```
