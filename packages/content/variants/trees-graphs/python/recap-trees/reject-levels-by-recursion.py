class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def insert(node, value):
    if node is None:
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    else:
        node.right = insert(node.right, value)
    return node


def collect(node, depth, rows):
    if node is None:
        return
    if depth == len(rows):
        rows.append([])
    rows[depth].append(node.value)
    collect(node.left, depth + 1, rows)
    collect(node.right, depth + 1, rows)


def leaves(node, out):
    if node:
        if node.left is None and node.right is None:
            out.append(node.value)
        leaves(node.left, out)
        leaves(node.right, out)
    return out


values = [50, 30, 70, 20, 40, 80]
target = 40

root = None
for v in values:
    root = insert(root, v)
rows = []
collect(root, 0, rows)
for depth, row in enumerate(rows):
    print(f"Level {depth}:", *row)
print("Leaves:", *leaves(root, []))
way = []
node = root
while node.value != target:
    way.append(node.value)
    node = node.left if target < node.value else node.right
print(f"Path to {target}:", *way, target)
