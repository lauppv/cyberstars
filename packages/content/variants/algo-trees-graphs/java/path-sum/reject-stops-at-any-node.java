class Solution {
    static boolean hasPathSum(Node root, int target) {
        if (root == null) {
            return false;
        }
        int rest = target - root.value;
        if (rest == 0) {
            return true;
        }
        return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
    }
}
