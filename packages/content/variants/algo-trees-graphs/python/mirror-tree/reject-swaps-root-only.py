def mirror(root):
    if root is not None:
        root.left, root.right = root.right, root.left
    return root
