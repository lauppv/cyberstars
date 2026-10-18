class Solution {
    static boolean hasPathSum(Node root, int target) {
        ArrayDeque<Node> stack = new ArrayDeque<>();
        ArrayDeque<Integer> sums = new ArrayDeque<>();
        if (root != null) {
            stack.push(root);
            sums.push(root.value);
        }
        while (!stack.isEmpty()) {
            Node node = stack.pop();
            int total = sums.pop();
            if (node.left == null && node.right == null && total == target) {
                return true;
            }
            if (node.left != null) {
                stack.push(node.left);
                sums.push(total + node.left.value);
            }
            if (node.right != null) {
                stack.push(node.right);
                sums.push(total + node.right.value);
            }
        }
        return false;
    }
}
