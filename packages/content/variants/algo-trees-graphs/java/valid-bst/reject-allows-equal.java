class Solution {
    static boolean fits(Node node, Node low, Node high) {
        if (node == null) {
            return true;
        }
        if (low != null && node.value < low.value) {
            return false;
        }
        if (high != null && node.value > high.value) {
            return false;
        }
        return fits(node.left, low, node) && fits(node.right, node, high);
    }

    static boolean isValidBst(Node root) {
        return fits(root, null, null);
    }
}
