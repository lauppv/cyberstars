class Solution {
    static boolean isValidBst(Node root) {
        if (root == null) {
            return true;
        }
        if (root.left != null && root.left.value >= root.value) {
            return false;
        }
        if (root.right != null && root.right.value <= root.value) {
            return false;
        }
        return isValidBst(root.left) && isValidBst(root.right);
    }
}
