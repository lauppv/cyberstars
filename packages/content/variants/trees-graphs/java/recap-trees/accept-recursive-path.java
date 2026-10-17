import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

class Node {
    int value;
    Node left, right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    static Node add(Node n, int v) {
        if (n == null) return new Node(v);
        if (v < n.value) n.left = add(n.left, v);
        else n.right = add(n.right, v);
        return n;
    }

    static void leaves(Node n, List<Integer> out) {
        if (n == null) return;
        if (n.left == null && n.right == null) out.add(n.value);
        leaves(n.left, out);
        leaves(n.right, out);
    }

    static String path(Node n, int t) {
        if (n.value == t) return " " + n.value;
        return " " + n.value + path(t < n.value ? n.left : n.right, t);
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 80};
        int target = 40;

        Node root = null;
        for (int v : values) root = add(root, v);

        Queue<Node> q = new LinkedList<>();
        q.add(root);
        for (int depth = 0; !q.isEmpty(); depth++) {
            StringBuilder row = new StringBuilder("Level " + depth + ":");
            for (int i = q.size(); i > 0; i--) {
                Node n = q.poll();
                row.append(' ').append(n.value);
                if (n.left != null) q.add(n.left);
                if (n.right != null) q.add(n.right);
            }
            System.out.println(row);
        }
        List<Integer> found = new ArrayList<>();
        leaves(root, found);
        StringBuilder line = new StringBuilder("Leaves:");
        for (int v : found) line.append(' ').append(v);
        System.out.println(line);
        System.out.println("Path to " + target + ":" + path(root, target));
    }
}
