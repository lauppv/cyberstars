def collect(node, values):
    if node is not None:
        collect(node.left, values)
        values.append(node.value)
        collect(node.right, values)


def is_valid_bst(root):
    values = []
    collect(root, values)
    return all(values[i] < values[i + 1] for i in range(len(values) - 1))
