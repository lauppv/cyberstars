def values(root):
    found = []
    queue = deque([root] if root is not None else [])
    while queue:
        node = queue.popleft()
        found.append(node.value)
        for child in (node.left, node.right):
            if child is not None:
                queue.append(child)
    return found


def same_tree(first, second):
    return values(first) == values(second)
