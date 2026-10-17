import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

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
        root.left.right = new Node(e);
        root.right.right = new Node(f);
        root.left.right.left = new Node(g);
        List<Integer> pre = new ArrayList<>();
        Deque<Node> stack = new ArrayDeque<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            Node n = stack.pop();
            pre.add(n.value);
            if (n.right != null) stack.push(n.right);
            if (n.left != null) stack.push(n.left);
        }

        List<Integer> mid = new ArrayList<>();
        Node cur = root;
        while (cur != null || !stack.isEmpty()) {
            while (cur != null) {
                stack.push(cur);
                cur = cur.left;
            }
            cur = stack.pop();
            mid.add(cur.value);
            cur = cur.right;
        }

        List<Integer> post = new ArrayList<>();
        stack.push(root);
        while (!stack.isEmpty()) {
            Node n = stack.pop();
            post.add(n.value);
            if (n.left != null) stack.push(n.left);
            if (n.right != null) stack.push(n.right);
        }
        Collections.reverse(post);

        String[] names = {"Preorder:", "Inorder:", "Postorder:"};
        List<List<Integer>> all = List.of(pre, mid, post);
        for (int k = 0; k < 3; k++) {
            StringBuilder line = new StringBuilder(names[k]);
            for (int v : all.get(k)) line.append(' ').append(v);
            System.out.println(line);
        }
    }
}
