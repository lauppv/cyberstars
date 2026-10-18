def common_ancestor(root, p, q):
    node = root
    while True:
        if p <= node.value and q <= node.value:
            node = node.left
        elif p >= node.value and q >= node.value:
            node = node.right
        else:
            return node.value
