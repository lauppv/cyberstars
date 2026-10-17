class Node {
    int value;
    Node left;
    Node right;

    Node(int value) {
        this.value = value;
    }
}

public class Main {
    static void preorder(Node node) {
        if (node == null) return;
        preorder(node.left);
        System.out.print(node.value + " ");
        preorder(node.right);
    }

    static void inorder(Node node) {
        if (node == null) return;
        System.out.print(node.value + " ");
        inorder(node.left);
        inorder(node.right);
    }

    static void postorder(Node node) {
        if (node == null) return;
        postorder(node.left);
        postorder(node.right);
        System.out.print(node.value + " ");
    }

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
        root.left.right = new Node(e);
        root.right.right = new Node(f);
        root.left.right.left = new Node(g);
        System.out.print("Preorder: ");
        preorder(root);
        System.out.println();
        System.out.print("Inorder: ");
        inorder(root);
        System.out.println();
        System.out.print("Postorder: ");
        postorder(root);
        System.out.println();
    }
}
