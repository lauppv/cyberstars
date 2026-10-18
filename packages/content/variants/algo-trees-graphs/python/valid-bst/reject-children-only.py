def is_valid_bst(root):
    if root is None:
        return True
    if root.left is not None and root.left.value >= root.value:
        return False
    if root.right is not None and root.right.value <= root.value:
        return False
    return is_valid_bst(root.left) and is_valid_bst(root.right)
