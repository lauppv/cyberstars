class Solution {
    static int commonAncestor(Node root, int p, int q) {
        if (p < root.value && q < root.value && root.left != null) {
            return root.left.value;
        }
        if (p > root.value && q > root.value && root.right != null) {
            return root.right.value;
        }
        return root.value;
    }
}
