import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
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
    // Turns a line like "8 4 11 2 null 9 15" into linked nodes, level by level.
    static Node buildTree(String line) {
        String[] tokens = line.trim().split("\\s+");
        if (tokens[0].isEmpty() || tokens[0].equals("null")) {
            return null;
        }
        Node root = new Node(Integer.parseInt(tokens[0]));
        Queue<Node> queue = new ArrayDeque<>();
        queue.add(root);
        int i = 1;
        while (i < tokens.length) {
            Node node = queue.remove();
            if (!tokens[i].equals("null")) {
                node.left = new Node(Integer.parseInt(tokens[i]));
                queue.add(node.left);
            }
            i++;
            if (i < tokens.length && !tokens[i].equals("null")) {
                node.right = new Node(Integer.parseInt(tokens[i]));
                queue.add(node.right);
            }
            i++;
        }
        return root;
    }

    static boolean sameTree(Node first, Node second) {
        java.util.LinkedList<Node[]> pairs = new java.util.LinkedList<>();
        pairs.add(new Node[] {first, second});
        while (!pairs.isEmpty()) {
            Node[] pair = pairs.remove();
            Node a = pair[0];
            Node b = pair[1];
            if (a == null && b == null) {
                continue;
            }
            if (a == null || b == null || a.value != b.value) {
                return false;
            }
            pairs.add(new Node[] {a.left, b.left});
            pairs.add(new Node[] {a.right, b.right});
        }
        return true;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        Node first = buildTree(reader.readLine());
        Node second = buildTree(reader.readLine());
        System.out.println(sameTree(first, second));
    }
}
