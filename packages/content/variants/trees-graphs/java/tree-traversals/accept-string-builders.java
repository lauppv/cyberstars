class Node {
    int v;
    Node l, r;

    Node(int v, Node l, Node r) {
        this.v = v;
        this.l = l;
        this.r = r;
    }
}

public class Main {
    static void walk(Node t, int order, StringBuilder out) {
        if (t == null) return;
        if (order == 0) out.append(' ').append(t.v);
        walk(t.l, order, out);
        if (order == 1) out.append(' ').append(t.v);
        walk(t.r, order, out);
        if (order == 2) out.append(' ').append(t.v);
    }

    public static void main(String[] args) {
        int a = 1;
        int b = 2;
        int c = 3;
        int d = 4;
        int e = 5;
        int f = 6;
        int g = 7;
        Node tree = new Node(a, new Node(b, new Node(d, null, null), new Node(e, new Node(g, null, null), null)), new Node(c, null, new Node(f, null, null)));
        String[] names = {"Preorder:", "Inorder:", "Postorder:"};
        for (int k = 0; k < 3; k++) {
            StringBuilder out = new StringBuilder(names[k]);
            walk(tree, k, out);
            System.out.println(out);
        }
    }
}
