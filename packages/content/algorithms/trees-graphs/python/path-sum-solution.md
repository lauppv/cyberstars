```py
def has_path_sum(root, target):
    if root is None:
        return False
    rest = target - root.value
    if root.left is None and root.right is None:
        return rest == 0
    return has_path_sum(root.left, rest) or has_path_sum(root.right, rest)
```
