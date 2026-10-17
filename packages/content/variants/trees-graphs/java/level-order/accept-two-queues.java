import java.util.LinkedList;
import java.util.Queue;

class Node {
    int value;
    Node left;
    Node right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    public static void main(String[] args) {
        int a = 1;
        int b = 2;
        int c = 3;
        int d = 4;
        int e = 5;
        int f = 6;
        int g = 7;
        Node root = new Node(a);
        root.left = new Node(b);
        root.right = new Node(c);
        root.left.left = new Node(d);
        root.right.left = new Node(e);
        root.right.right = new Node(f);
        root.right.left.right = new Node(g);
        Queue<Node> nodes = new LinkedList<>();
        Queue<Integer> depths = new LinkedList<>();
        nodes.add(root);
        depths.add(0);
        int current = -1;
        StringBuilder line = new StringBuilder();
        while (!nodes.isEmpty()) {
            Node n = nodes.poll();
            int depth = depths.poll();
            if (depth != current) {
                if (current >= 0) System.out.println(line);
                current = depth;
                line = new StringBuilder("Level " + depth + ":");
            }
            line.append(" ").append(n.value);
            for (Node child : new Node[] {n.left, n.right}) {
                if (child != null) {
                    nodes.add(child);
                    depths.add(depth + 1);
                }
            }
        }
        System.out.println(line);
    }
}
