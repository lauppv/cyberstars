```py
from collections import deque


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


# Turns a line like "8 4 11 2 null 9 15" into linked nodes, level by level.
def build_tree(line):
    tokens = line.split()
    if not tokens or tokens[0] == "null":
        return None
    root = Node(int(tokens[0]))
    queue = deque([root])
    i = 1
    while i < len(tokens):
        node = queue.popleft()
        if tokens[i] != "null":
            node.left = Node(int(tokens[i]))
            queue.append(node.left)
        i += 1
        if i < len(tokens) and tokens[i] != "null":
            node.right = Node(int(tokens[i]))
            queue.append(node.right)
        i += 1
    return root


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


root = build_tree(input())
print("true" if is_valid_bst(root) else "false")
```
