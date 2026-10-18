class Solution {
    static void walk(Node node, java.util.List<Integer> values) {
        if (node != null) {
            values.add(node.value);
            walk(node.left, values);
            walk(node.right, values);
        }
    }

    static int kthSmallest(Node root, int k) {
        java.util.List<Integer> values = new java.util.ArrayList<>();
        walk(root, values);
        return values.get(k - 1);
    }
}
