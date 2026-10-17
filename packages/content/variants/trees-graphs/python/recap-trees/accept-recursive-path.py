from collections import deque


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def add(node, value):
    if not node:
        return Node(value)
    if value < node.value:
        node.left = add(node.left, value)
    else:
        node.right = add(node.right, value)
    return node


def leaves(node, out):
    if node:
        if not node.left and not node.right:
            out.append(node.value)
        leaves(node.left, out)
        leaves(node.right, out)
    return out


def path(node, target):
    if node.value == target:
        return [node.value]
    nxt = node.left if target < node.value else node.right
    return [node.value] + path(nxt, target)


values = [50, 30, 70, 20, 40, 80]
target = 40

root = None
for v in values:
    root = add(root, v)

q = deque([(root, 0)])
rows = []
while q:
    n, depth = q.popleft()
    if depth == len(rows):
        rows.append([])
    rows[depth].append(str(n.value))
    q.extend((child, depth + 1) for child in (n.left, n.right) if child)
for depth, row in enumerate(rows):
    print(f"Level {depth}: {' '.join(row)}")
print("Leaves:", *leaves(root, []))
print(f"Path to {target}:", *path(root, target))
