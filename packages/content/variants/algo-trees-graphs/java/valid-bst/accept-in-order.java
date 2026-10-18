class Solution {
    static void collect(Node node, java.util.List<Integer> values) {
        if (node != null) {
            collect(node.left, values);
            values.add(node.value);
            collect(node.right, values);
        }
    }

    static boolean isValidBst(Node root) {
        java.util.List<Integer> values = new java.util.ArrayList<>();
        collect(root, values);
        for (int i = 0; i + 1 < values.size(); i++) {
            if (values.get(i) >= values.get(i + 1)) {
                return false;
            }
        }
        return true;
    }
}
