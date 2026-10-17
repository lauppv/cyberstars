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


def collect(node, depth, levels):
    if node is None:
        return
    if depth == len(levels):
        levels.append([])
    levels[depth].append(node.value)
    collect(node.left, depth + 1, levels)
    collect(node.right, depth + 1, levels)


def print_levels(root):
    levels = []
    collect(root, 0, levels)
    for values in levels:
        print(*values)


root = build_tree(input())
print_levels(root)
