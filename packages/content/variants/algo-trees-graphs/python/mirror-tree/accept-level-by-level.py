def mirror(root):
    queue = deque([root] if root is not None else [])
    while queue:
        node = queue.popleft()
        node.left, node.right = node.right, node.left
        for child in (node.left, node.right):
            if child is not None:
                queue.append(child)
    return root
