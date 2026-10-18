def has_path_sum(root, target):
    if root is None:
        return False
    rest = target - root.value
    if rest == 0:
        return True
    return has_path_sum(root.left, rest) or has_path_sum(root.right, rest)
