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


def print_levels(root):
    if root is None:
        return
    queue = deque([root])
    while queue:
        values = []
        for _ in range(len(queue)):
            node = queue.popleft()
            values.append(str(node.value))
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        print(" ".join(values))


root = build_tree(input())
print_levels(root)
```
