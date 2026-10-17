```py
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None


def preorder(node):
    if node is None:
        return
    print(node.value, end=" ")
    preorder(node.left)
    preorder(node.right)


def inorder(node):
    if node is None:
        return
    inorder(node.left)
    print(node.value, end=" ")
    inorder(node.right)


def postorder(node):
    if node is None:
        return
    postorder(node.left)
    postorder(node.right)
    print(node.value, end=" ")


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
root.left.right = Node(e)
root.right.right = Node(f)
root.left.right.left = Node(g)

print("Preorder:", end=" ")
preorder(root)
print()
print("Inorder:", end=" ")
inorder(root)
print()
print("Postorder:", end=" ")
postorder(root)
print()
```
