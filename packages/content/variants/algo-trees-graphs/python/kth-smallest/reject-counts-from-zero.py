def kth_smallest(root, k):
    stack = []
    node = root
    while True:
        while node is not None:
            stack.append(node)
            node = node.left
        node = stack.pop()
        if k == 0:
            return node.value
        k -= 1
        node = node.right
