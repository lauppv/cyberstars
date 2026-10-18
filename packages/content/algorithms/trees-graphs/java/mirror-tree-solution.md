```java
class Solution {
    static Node mirror(Node root) {
        if (root == null) {
            return null;
        }
        Node left = mirror(root.left);
        root.left = mirror(root.right);
        root.right = left;
        return root;
    }
}
```
