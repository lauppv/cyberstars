def max_depth(root):
    levels = 0
    level = [root] if root else []
    while level:
        levels += 1
        level = [child for n in level for child in (n.left, n.right) if child]
    return levels
