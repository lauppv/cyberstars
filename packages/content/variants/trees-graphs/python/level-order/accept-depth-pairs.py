from collections import deque

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


a = 1
b = 2
c = 3
d = 4
e = 5
f = 6
g = 7

root = Node(a)
root.left = Node(b)
root.right = Node(c)
root.left.left = Node(d)
root.right.left = Node(e)
root.right.right = Node(f)
root.right.left.right = Node(g)

levels = {}
q = deque([(root, 0)])
while q:
    n, depth = q.popleft()
    levels.setdefault(depth, []).append(str(n.value))
    for child in (n.left, n.right):
        if child:
            q.append((child, depth + 1))
for depth in sorted(levels):
    print(f"Level {depth}: " + " ".join(levels[depth]))
