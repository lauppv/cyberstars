```py
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
```
