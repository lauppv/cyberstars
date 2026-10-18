class Solution {
    static boolean sameTree(Node first, Node second) {
        java.util.LinkedList<Node[]> pairs = new java.util.LinkedList<>();
        pairs.add(new Node[] {first, second});
        while (!pairs.isEmpty()) {
            Node[] pair = pairs.remove();
            Node a = pair[0];
            Node b = pair[1];
            if (a == null && b == null) {
                continue;
            }
            if (a == null || b == null || a.value != b.value) {
                return false;
            }
            pairs.add(new Node[] {a.left, b.left});
            pairs.add(new Node[] {a.right, b.right});
        }
        return true;
    }
}
