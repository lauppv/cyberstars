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

    // Writes a tree back as one line, level by level, like the input.
    static String treeToLine(Node root) {
        if (root == null) {
            return "null";
        }
        StringBuilder line = new StringBuilder(String.valueOf(root.value));
        // Where the last value ends: the nulls after it are left out.
        int kept = line.length();
        Queue<Node> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Node node = queue.remove();
            for (Node child : new Node[] {node.left, node.right}) {
                if (child == null) {
                    line.append(" null");
                } else {
                    line.append(" ").append(child.value);
                    kept = line.length();
                    queue.add(child);
                }
            }
        }
        return line.substring(0, kept);
    }

    static Node mirror(Node root) {
        if (root != null) {
            Node left = root.left;
            root.left = root.right;
            root.right = left;
        }
        return root;
    }

    public static void main(String[] args) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        Node root = buildTree(reader.readLine());
        System.out.println(treeToLine(mirror(root)));
    }
}
