class Solution {
    static boolean hasPathSum(Node root, int target) {
        if (root == null) {
            return target == 0;
        }
        int rest = target - root.value;
        return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
    }
}
