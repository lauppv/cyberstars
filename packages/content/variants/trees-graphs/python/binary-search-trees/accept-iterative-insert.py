class Node:
    def __init__(self, value):
        self.value = value
        self.left = self.right = None


def walk(node, out):
    if node:
        walk(node.left, out)
        out.append(node.value)
        walk(node.right, out)
    return out


def depth(node):
    if not node:
        return -1
    return max(depth(node.left), depth(node.right)) + 1


values = [50, 30, 70, 20, 40, 60, 80]
target = 60

root = None
for v in values:
    if root is None:
        root = Node(v)
        continue
    cur = root
    while True:
        if v < cur.value:
            if cur.left is None:
                cur.left = Node(v)
                break
            cur = cur.left
        else:
            if cur.right is None:
                cur.right = Node(v)
                break
            cur = cur.right

found = False
cur = root
while cur is not None and not found:
    if cur.value == target:
        found = True
    elif target < cur.value:
        cur = cur.left
    else:
        cur = cur.right

print("Sorted: " + " ".join(map(str, walk(root, []))))
print(f"Height: {depth(root)}")
print(f"Search {target}: {'found' if found else 'not found'}")
