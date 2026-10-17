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
        int a = 8;
        int b = 3;
        int c = 10;
        int d = 1;
        int e = 6;
        Node root = new Node(a);
        root.left = new Node(b);
        root.right = new Node(c);
        root.left.left = new Node(d);
        root.left.right = new Node(e);
        System.out.println("Root: " + root.value);
        System.out.println("Children: " + root.left.value + " " + root.right.value);
        System.out.println("Leaves: " + root.left.left.value + " " + root.left.right.value);
    }
}
