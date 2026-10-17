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
        System.out.println("Preorder: " + a + " " + b + " " + d + " " + e + " " + g + " " + c + " " + f);
        System.out.println("Inorder: " + d + " " + b + " " + g + " " + e + " " + a + " " + c + " " + f);
        System.out.println("Postorder: " + d + " " + g + " " + e + " " + b + " " + f + " " + c + " " + a);
    }
}
