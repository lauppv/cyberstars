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
        System.out.println("Level 0: " + a);
        System.out.println("Level 1: " + b + " " + c);
        System.out.println("Level 2: " + d + " " + e + " " + f);
        System.out.println("Level 3: " + g);
    }
}
