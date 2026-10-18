class Solution {
    static String values(Node root) {
        StringBuilder found = new StringBuilder();
        Queue<Node> queue = new ArrayDeque<>();
        if (root != null) {
            queue.add(root);
        }
        while (!queue.isEmpty()) {
            Node node = queue.remove();
            found.append(node.value).append(' ');
            if (node.left != null) {
                queue.add(node.left);
            }
            if (node.right != null) {
                queue.add(node.right);
            }
        }
        return found.toString();
    }

    static boolean sameTree(Node first, Node second) {
        return values(first).equals(values(second));
    }
}
