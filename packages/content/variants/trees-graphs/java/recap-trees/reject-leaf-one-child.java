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
    static Node insert(Node node, int value) {
        if (node == null) {
            return new Node(value);
        }
        if (value < node.value) {
            node.left = insert(node.left, value);
        } else {
            node.right = insert(node.right, value);
        }
        return node;
    }

    static void printLeaves(Node node) {
        if (node == null) {
            return;
        }
        if (node.left == null || node.right == null) {
            System.out.print(node.value + " ");
        }
        printLeaves(node.left);
        printLeaves(node.right);
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 80};
        int target = 40;

        Node root = null;
        for (int value : values) {
            root = insert(root, value);
        }

        Queue<Node> queue = new ArrayDeque<>();
        queue.add(root);
        int level = 0;
        while (!queue.isEmpty()) {
            int size = queue.size();
            System.out.print("Level " + level + ": ");
            for (int i = 0; i < size; i++) {
                Node node = queue.poll();
                System.out.print(node.value + " ");
                if (node.left != null) {
                    queue.add(node.left);
                }
                if (node.right != null) {
                    queue.add(node.right);
                }
            }
            System.out.println();
            level++;
        }

        System.out.print("Leaves: ");
        printLeaves(root);
        System.out.println();

        System.out.print("Path to " + target + ": ");
        Node node = root;
        while (node.value != target) {
            System.out.print(node.value + " ");
            if (target < node.value) {
                node = node.left;
            } else {
                node = node.right;
            }
        }
        System.out.println(node.value);
    }
}
