from collections import deque


class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


values = [50, 30, 70, 20, 40, 60, 80]
target = 60

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

out = []
stack = []
cur = root
while stack or cur:
    while cur:
        stack.append(cur)
        cur = cur.left
    cur = stack.pop()
    out.append(cur.value)
    cur = cur.right

height = -1
queue = deque([root])
while queue:
    height += 1
    for i in range(len(queue)):
        n = queue.popleft()
        for child in (n.left, n.right):
            if child:
                queue.append(child)

found = False
cur = root
while cur and not found:
    found = cur.value == target
    cur = cur.left if target < cur.value else cur.right

print("Sorted:", *out)
print("Height:", height)
print(f"Search {target}: {'found' if found else 'not found'}")
