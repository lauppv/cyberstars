class Solution {
    static int maxDepth(Node root) {
        if (root == null) {
            return 0;
        }
        Queue<Node> level = new ArrayDeque<>();
        level.add(root);
        int levels = 0;
        while (!level.isEmpty()) {
            levels++;
            for (int k = level.size(); k > 0; k--) {
                Node n = level.remove();
                if (n.left != null) level.add(n.left);
                if (n.right != null) level.add(n.right);
            }
        }
        return levels;
    }
}
