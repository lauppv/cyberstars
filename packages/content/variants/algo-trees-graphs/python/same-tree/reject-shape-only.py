def same_tree(first, second):
    if first is None or second is None:
        return first is None and second is None
    return same_tree(first.left, second.left) and same_tree(first.right, second.right)
