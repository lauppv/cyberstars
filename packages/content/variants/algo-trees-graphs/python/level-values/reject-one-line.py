def print_levels(root):
    if root is None:
        return
    values = []
    queue = deque([root])
    while queue:
        node = queue.popleft()
        values.append(str(node.value))
        for child in (node.left, node.right):
            if child is not None:
                queue.append(child)
    print(" ".join(values))
