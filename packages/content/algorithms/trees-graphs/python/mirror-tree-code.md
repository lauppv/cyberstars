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


# Writes a tree back as one line, level by level, like the input.
def tree_to_line(root):
    if root is None:
        return "null"
    tokens = [str(root.value)]
    # How many tokens end with a value: the nulls after it are left out.
    kept = 1
    queue = deque([root])
    while queue:
        node = queue.popleft()
        for child in (node.left, node.right):
            if child is None:
                tokens.append("null")
            else:
                tokens.append(str(child.value))
                kept = len(tokens)
                queue.append(child)
    return " ".join(tokens[:kept])


def mirror(root):
    # Write your code here
    return root


root = build_tree(input())
print(tree_to_line(mirror(root)))
