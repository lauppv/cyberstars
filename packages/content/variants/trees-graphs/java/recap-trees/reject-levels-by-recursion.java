import java.util.ArrayList;
import java.util.List;

class Node {
    int value;
    Node left, right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    static Node insert(Node n, int v) {
        if (n == null) return new Node(v);
        if (v < n.value) n.left = insert(n.left, v);
        else n.right = insert(n.right, v);
        return n;
    }

    static void collect(Node n, int depth, List<StringBuilder> rows) {
        if (n == null) return;
        if (depth == rows.size()) rows.add(new StringBuilder("Level " + depth + ":"));
        rows.get(depth).append(' ').append(n.value);
        collect(n.left, depth + 1, rows);
        collect(n.right, depth + 1, rows);
    }

    static void leaves(Node n, StringBuilder out) {
        if (n == null) return;
        if (n.left == null && n.right == null) out.append(' ').append(n.value);
        leaves(n.left, out);
        leaves(n.right, out);
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 80};
        int target = 40;

        Node root = null;
        for (int v : values) root = insert(root, v);
        List<StringBuilder> rows = new ArrayList<>();
        collect(root, 0, rows);
        for (StringBuilder row : rows) System.out.println(row);
        StringBuilder out = new StringBuilder("Leaves:");
        leaves(root, out);
        System.out.println(out);
        StringBuilder way = new StringBuilder("Path to " + target + ":");
        Node n = root;
        while (n.value != target) {
            way.append(' ').append(n.value);
            n = target < n.value ? n.left : n.right;
        }
        System.out.println(way + " " + target);
    }
}
