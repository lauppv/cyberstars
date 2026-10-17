from collections import deque


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


values = [50, 30, 70, 20, 40, 80]
target = 40

root = None
for v in values:
    if root is None:
        root = Node(v)
        continue
    cur = root
    while True:
        side = "left" if v < cur.value else "right"
        if getattr(cur, side) is None:
            setattr(cur, side, Node(v))
            break
        cur = getattr(cur, side)

queue = deque([root])
level = 0
while queue:
    row = []
    for i in range(len(queue)):
        n = queue.popleft()
        row.append(n.value)
        for child in (n.left, n.right):
            if child:
                queue.append(child)
    print(f"Level {level}:", *row)
    level += 1

found = []
stack = [root]
while stack:
    n = stack.pop()
    if not n.left and not n.right:
        found.append(n.value)
    for child in (n.right, n.left):
        if child:
            stack.append(child)
print("Leaves:", *found)

way = []
node = root
while node.value != target:
    way.append(node.value)
    node = node.left if target < node.value else node.right
print(f"Path to {target}:", *way, target)
