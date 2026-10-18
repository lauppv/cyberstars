```java
class Solution {
    static int commonAncestor(Node root, int p, int q) {
        Node node = root;
        while (true) {
            if (p < node.value && q < node.value) {
                node = node.left;
            } else if (p > node.value && q > node.value) {
                node = node.right;
            } else {
                return node.value;
            }
        }
    }
}
```
