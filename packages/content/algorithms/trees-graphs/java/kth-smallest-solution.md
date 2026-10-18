```java
class Solution {
    static int kthSmallest(Node root, int k) {
        ArrayDeque<Node> stack = new ArrayDeque<>();
        Node node = root;
        while (true) {
            while (node != null) {
                stack.push(node);
                node = node.left;
            }
            node = stack.pop();
            k--;
            if (k == 0) {
                return node.value;
            }
            node = node.right;
        }
    }
}
```
