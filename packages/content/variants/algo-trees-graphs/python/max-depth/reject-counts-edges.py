def max_depth(root):
    if root is None:
        return 0
    if root.left is None and root.right is None:
        return 0
    return 1 + max(max_depth(root.left), max_depth(root.right))
