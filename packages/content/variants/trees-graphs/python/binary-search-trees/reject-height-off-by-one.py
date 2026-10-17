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


def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value, end=" ")
    inorder(node.right)


def height(node):
    if node is None:
        return 0
    return 1 + max(height(node.left), height(node.right))


def search(node, target):
    if node is None:
        return False
    if target == node.value:
        return True
    if target < node.value:
        return search(node.left, target)
    return search(node.right, target)


values = [50, 30, 70, 20, 40, 60, 80]
target = 60

root = None
for value in values:
    root = insert(root, value)

print("Sorted:", end=" ")
inorder(root)
print()
print("Height:", height(root))
if search(root, target):
    print(f"Search {target}: found")
else:
    print(f"Search {target}: not found")
