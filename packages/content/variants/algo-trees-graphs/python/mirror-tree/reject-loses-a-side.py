def mirror(root):
    if root is not None:
        root.left = mirror(root.right)
        root.right = mirror(root.left)
    return root
