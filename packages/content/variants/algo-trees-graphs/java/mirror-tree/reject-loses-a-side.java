class Solution {
    static Node mirror(Node root) {
        if (root != null) {
            root.left = mirror(root.right);
            root.right = mirror(root.left);
        }
        return root;
    }
}
