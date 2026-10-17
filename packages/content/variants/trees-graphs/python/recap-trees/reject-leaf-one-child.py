from collections import deque


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


def print_leaves(node):
    if node is None:
        return
    if node.left is None or node.right is None:
        print(node.value, end=" ")
    print_leaves(node.left)
    print_leaves(node.right)


values = [50, 30, 70, 20, 40, 80]
target = 40

root = None
for value in values:
    root = insert(root, value)

queue = deque()
queue.append(root)
level = 0
while len(queue) > 0:
    size = len(queue)
    print(f"Level {level}:", end=" ")
    for i in range(size):
        node = queue.popleft()
        print(node.value, end=" ")
        if node.left is not None:
            queue.append(node.left)
        if node.right is not None:
            queue.append(node.right)
    print()
    level += 1

print("Leaves:", end=" ")
print_leaves(root)
print()

print(f"Path to {target}:", end=" ")
node = root
while node.value != target:
    print(node.value, end=" ")
    if target < node.value:
        node = node.left
    else:
        node = node.right
print(node.value)
