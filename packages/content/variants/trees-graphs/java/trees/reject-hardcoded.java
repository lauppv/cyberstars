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
        System.out.println("Root: 8");
        System.out.println("Children: 3 10");
        System.out.println("Leaves: 1 6 10");
    }
}
