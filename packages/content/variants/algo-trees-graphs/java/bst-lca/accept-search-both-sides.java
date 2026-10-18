class Solution {
    static Node find(Node node, int p, int q) {
        if (node == null || node.value == p || node.value == q) {
            return node;
        }
        Node left = find(node.left, p, q);
        Node right = find(node.right, p, q);
        if (left != null && right != null) {
            return node;
        }
        return left != null ? left : right;
    }

    static int commonAncestor(Node root, int p, int q) {
        return find(root, p, q).value;
    }
}
