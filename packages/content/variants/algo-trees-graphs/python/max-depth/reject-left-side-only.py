def max_depth(root):
    depth = 0
    while root is not None:
        depth += 1
        root = root.left
    return depth
