def walk(node, values):
    if node is not None:
        values.append(node.value)
        walk(node.left, values)
        walk(node.right, values)


def kth_smallest(root, k):
    values = []
    walk(root, values)
    return values[k - 1]
