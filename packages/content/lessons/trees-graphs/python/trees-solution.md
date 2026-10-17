```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


a = 8
b = 3
c = 10
d = 1
e = 6

root = Node(a)
root.left = Node(b)
root.right = Node(c)
root.left.left = Node(d)
root.left.right = Node(e)

print("Root:", root.value)
print("Children:", root.left.value, root.right.value)
print("Leaves:", root.left.left.value, root.left.right.value, root.right.value)
```
