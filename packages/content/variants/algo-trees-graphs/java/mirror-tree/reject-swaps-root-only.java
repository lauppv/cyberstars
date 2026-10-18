class Solution {
    static Node mirror(Node root) {
        if (root != null) {
            Node left = root.left;
            root.left = root.right;
            root.right = left;
        }
        return root;
    }
}
