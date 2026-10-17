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


def find(node, p, q):
    if node is None or node.value in (p, q):
        return node
    left = find(node.left, p, q)
    right = find(node.right, p, q)
    if left is not None and right is not None:
        return node
    return left if left is not None else right


def common_ancestor(root, p, q):
    return find(root, p, q).value


root = build_tree(input())
p, q = map(int, input().split())
print(common_ancestor(root, p, q))
