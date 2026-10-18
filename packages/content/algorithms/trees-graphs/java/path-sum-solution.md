```java
class Solution {
    static boolean hasPathSum(Node root, int target) {
        if (root == null) {
            return false;
        }
        int rest = target - root.value;
        if (root.left == null && root.right == null) {
            return rest == 0;
        }
        return hasPathSum(root.left, rest) || hasPathSum(root.right, rest);
    }
}
```
