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

    static void inorder(Node node) {
        if (node == null) {
            return;
        }
        inorder(node.left);
        System.out.print(node.value + " ");
        inorder(node.right);
    }

    static int height(Node node) {
        if (node == null) {
            return 0;
        }
        return 1 + Math.max(height(node.left), height(node.right));
    }

    static boolean search(Node node, int target) {
        if (node == null) {
            return false;
        }
        if (target == node.value) {
            return true;
        }
        if (target < node.value) {
            return search(node.left, target);
        }
        return search(node.right, target);
    }

    public static void main(String[] args) {
        int[] values = {50, 30, 70, 20, 40, 60, 80};
        int target = 60;

        Node root = null;
        for (int value : values) {
            root = insert(root, value);
        }

        System.out.print("Sorted: ");
        inorder(root);
        System.out.println();
        System.out.println("Height: " + height(root));
        if (search(root, target)) {
            System.out.println("Search " + target + ": found");
        } else {
            System.out.println("Search " + target + ": not found");
        }
    }
}
