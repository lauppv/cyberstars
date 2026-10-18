def common_ancestor(root, p, q):
    if p < root.value and q < root.value and root.left is not None:
        return root.left.value
    if p > root.value and q > root.value and root.right is not None:
        return root.right.value
    return root.value
