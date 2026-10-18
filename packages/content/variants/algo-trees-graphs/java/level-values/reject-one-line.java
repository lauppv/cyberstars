class Solution {
    static void printLevels(Node root) {
        if (root == null) {
            return;
        }
        StringBuilder values = new StringBuilder();
        Queue<Node> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            Node node = queue.remove();
            if (values.length() > 0) {
                values.append(" ");
            }
            values.append(node.value);
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        System.out.println(values);
    }
}
