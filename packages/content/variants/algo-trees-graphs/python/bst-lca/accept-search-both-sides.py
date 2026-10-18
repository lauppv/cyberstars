def find(node, p, q):
    if node is None or node.value in (p, q):
        return node
    left = find(node.left, p, q)
    right = find(node.right, p, q)
    if left is not None and right is not None:
        return node
    return left if left is not None else right


def common_ancestor(root, p, q):
    return find(root, p, q).value
