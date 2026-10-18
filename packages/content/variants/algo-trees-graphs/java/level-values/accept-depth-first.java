class Solution {
    static void collect(Node node, int depth, java.util.List<StringBuilder> levels) {
        if (node == null) {
            return;
        }
        if (depth == levels.size()) {
            levels.add(new StringBuilder(String.valueOf(node.value)));
        } else {
            levels.get(depth).append(' ').append(node.value);
        }
        collect(node.left, depth + 1, levels);
        collect(node.right, depth + 1, levels);
    }

    static void printLevels(Node root) {
        java.util.List<StringBuilder> levels = new java.util.ArrayList<>();
        collect(root, 0, levels);
        for (StringBuilder values : levels) {
            System.out.println(values);
        }
    }
}
