class Node {
    int value;
    Node left, right;

    Node(int value, Node left, Node right) {
        this.value = value;
        this.left = left;
        this.right = right;
    }

    Node(int value) {
        this(value, null, null);
    }
}

public class Main {
    public static void main(String[] args) {
        int a = 8;
        int b = 3;
        int c = 10;
        int d = 1;
        int e = 6;
        Node tree = new Node(a, new Node(b, new Node(d), new Node(e)), new Node(c));
        Node[] leaves = {tree.left.left, tree.left.right, tree.right};
        System.out.println("Root: " + tree.value);
        System.out.println("Children: " + tree.left.value + " " + tree.right.value);
        StringBuilder line = new StringBuilder("Leaves:");
        for (Node leaf : leaves) {
            line.append(" ").append(leaf.value);
        }
        System.out.println(line);
    }
}
