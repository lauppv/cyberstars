class Solution {
    static void collect(Node node, java.util.List<Integer> values) {
        if (node != null) {
            values.add(node.value);
            collect(node.left, values);
            collect(node.right, values);
        }
    }

    static int kthSmallest(Node root, int k) {
        java.util.List<Integer> values = new java.util.ArrayList<>();
        collect(root, values);
        java.util.Collections.sort(values);
        return values.get(k - 1);
    }
}
