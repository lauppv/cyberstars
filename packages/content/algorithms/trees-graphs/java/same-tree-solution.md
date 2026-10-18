```java
class Solution {
    static boolean sameTree(Node first, Node second) {
        if (first == null || second == null) {
            return first == null && second == null;
        }
        return first.value == second.value
                && sameTree(first.left, second.left)
                && sameTree(first.right, second.right);
    }
}
```
