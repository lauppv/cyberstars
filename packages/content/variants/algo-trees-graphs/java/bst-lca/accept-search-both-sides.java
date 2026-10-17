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

    static Node find(Node node, int p, int q) {
        if (node == null || node.value == p || node.value == q) {
            return node;
        }
        Node left = find(node.left, p, q);
        Node right = find(node.right, p, q);
        if (left != null && right != null) {
            return node;
        }
        return left != null ? left : right;
    }

    static int commonAncestor(Node root, int p, int q) {
        return find(root, p, q).value;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        Node root = buildTree(reader.readLine());
        String[] pair = reader.readLine().trim().split("\\s+");
        int p = Integer.parseInt(pair[0]);
        int q = Integer.parseInt(pair[1]);
        System.out.println(commonAncestor(root, p, q));
    }
}
