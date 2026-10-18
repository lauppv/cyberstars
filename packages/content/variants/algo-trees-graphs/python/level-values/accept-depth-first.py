def collect(node, depth, levels):
    if node is None:
        return
    if depth == len(levels):
        levels.append([])
    levels[depth].append(node.value)
    collect(node.left, depth + 1, levels)
    collect(node.right, depth + 1, levels)


def print_levels(root):
    levels = []
    collect(root, 0, levels)
    for values in levels:
        print(*values)
