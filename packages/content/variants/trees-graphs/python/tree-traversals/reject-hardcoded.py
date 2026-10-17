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
print("Preorder:", a, b, d, e, g, c, f)
print("Inorder:", d, b, g, e, a, c, f)
print("Postorder:", d, g, e, b, f, c, a)
