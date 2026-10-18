def has_path_sum(root, target):
    stack = [(root, root.value)] if root is not None else []
    while stack:
        node, total = stack.pop()
        if node.left is None and node.right is None and total == target:
            return True
        for child in (node.left, node.right):
            if child is not None:
                stack.append((child, total + child.value))
    return False
