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


first = build_tree(input())
second = build_tree(input())
print("true" if same_tree(first, second) else "false")
