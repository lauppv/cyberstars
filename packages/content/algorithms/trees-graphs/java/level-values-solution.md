```java
class Solution {
    static void printLevels(Node root) {
        if (root == null) {
            return;
        }
        Queue<Node> queue = new ArrayDeque<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            StringBuilder values = new StringBuilder();
            for (int i = 0; i < levelSize; i++) {
                Node node = queue.remove();
                if (i > 0) {
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
}
```
