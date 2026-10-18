def collect(node, values):
    if node is not None:
        values.append(node.value)
        collect(node.left, values)
        collect(node.right, values)


def kth_smallest(root, k):
    values = []
    collect(root, values)
    return sorted(values)[k - 1]
