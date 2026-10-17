class Node {
    final int value;
    Node left, right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    static String walk(Node n) {
        if (n == null) return "";
        return walk(n.left) + " " + n.value + walk(n.right);
    }

    static int depth(Node n) {
        return n == null ? -1 : Math.max(depth(n.left), depth(n.right)) + 1;
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        int target = 60;

        Node root = null;
        for (int v : values) {
            Node fresh = new Node(v);
            if (root == null) {
                root = fresh;
                continue;
            }
            Node cur = root;
            while (true) {
                if (v < cur.value) {
                    if (cur.left == null) { cur.left = fresh; break; }
                    cur = cur.left;
                } else {
                    if (cur.right == null) { cur.right = fresh; break; }
                    cur = cur.right;
                }
            }
        }

        boolean found = false;
        for (Node cur = root; cur != null && !found; cur = target < cur.value ? cur.left : cur.right) {
            found = cur.value == target;
        }

        System.out.println("Sorted:" + walk(root));
        System.out.println("Height: " + depth(root));
        System.out.println("Search " + target + ": " + (found ? "found" : "not found"));
    }
}
