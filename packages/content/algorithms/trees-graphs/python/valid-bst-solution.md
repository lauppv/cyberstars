```py
# low and high are the nodes whose values bound this subtree; None means no bound.
def fits(node, low, high):
    if node is None:
        return True
    if low is not None and node.value <= low.value:
        return False
    if high is not None and node.value >= high.value:
        return False
    return fits(node.left, low, node) and fits(node.right, node, high)


def is_valid_bst(root):
    return fits(root, None, None)
```
