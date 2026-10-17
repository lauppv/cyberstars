import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Queue;

class Node {
    int value;
    Node left, right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 80};
        int target = 40;

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

        Queue<Node> queue = new ArrayDeque<>();
        queue.add(root);
        for (int level = 0; !queue.isEmpty(); level++) {
            StringBuilder row = new StringBuilder("Level " + level + ":");
            for (int i = queue.size(); i > 0; i--) {
                Node n = queue.poll();
                row.append(' ').append(n.value);
                if (n.left != null) queue.add(n.left);
                if (n.right != null) queue.add(n.right);
            }
            System.out.println(row);
        }

        StringBuilder leaves = new StringBuilder("Leaves:");
        Deque<Node> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            Node n = stack.pop();
            if (n.left == null && n.right == null) leaves.append(' ').append(n.value);
            if (n.right != null) stack.push(n.right);
            if (n.left != null) stack.push(n.left);
        }
        System.out.println(leaves);

        StringBuilder way = new StringBuilder("Path to " + target + ":");
        Node n = root;
        while (n.value != target) {
            way.append(' ').append(n.value);
            n = target < n.value ? n.left : n.right;
        }
        System.out.println(way + " " + target);
    }
}
