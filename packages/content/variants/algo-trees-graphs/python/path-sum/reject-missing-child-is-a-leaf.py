def has_path_sum(root, target):
    if root is None:
        return target == 0
    rest = target - root.value
    return has_path_sum(root.left, rest) or has_path_sum(root.right, rest)
