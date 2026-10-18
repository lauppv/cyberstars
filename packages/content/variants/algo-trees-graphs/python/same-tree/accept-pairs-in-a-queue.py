def same_tree(first, second):
    pairs = deque([(first, second)])
    while pairs:
        a, b = pairs.popleft()
        if a is None and b is None:
            continue
        if a is None or b is None or a.value != b.value:
            return False
        pairs.append((a.left, b.left))
        pairs.append((a.right, b.right))
    return True
