import java.util.ArrayDeque;
import java.util.Deque;

class Node {
    int value;
    Node left, right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        int target = 60;

        Node root = null;
        for (int v : values) {
            if (root == null) { root = new Node(v); continue; }
            Node cur = root;
            while (true) {
                if (v < cur.value) {
                    if (cur.left == null) { cur.left = new Node(v); break; }
                    cur = cur.left;
                } else {
                    if (cur.right == null) { cur.right = new Node(v); break; }
                    cur = cur.right;
                }
            }
        }

        StringBuilder sorted = new StringBuilder("Sorted:");
        Deque<Node> stack = new ArrayDeque<>();
        Node cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) { stack.push(cur); cur = cur.left; }
            cur = stack.pop();
            sorted.append(' ').append(cur.value);
            cur = cur.right;
        }

        int height = -1;
        Deque<Node> level = new ArrayDeque<>();
        level.add(root);
        while (!level.isEmpty()) {
            height++;
            for (int i = level.size(); i > 0; i--) {
                Node n = level.poll();
                if (n.left != null) level.add(n.left);
                if (n.right != null) level.add(n.right);
            }
        }

        boolean found = false;
        for (Node n = root; n != null && !found; n = target < n.value ? n.left : n.right) {
            found = n.value == target;
        }

        System.out.println(sorted);
        System.out.println("Height: " + height);
        System.out.println("Search " + target + ": " + (found ? "found" : "not found"));
    }
}
