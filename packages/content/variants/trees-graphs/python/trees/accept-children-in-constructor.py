class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


a = 8
b = 3
c = 10
d = 1
e = 6

tree = Node(a, Node(b, Node(d), Node(e)), Node(c))
leaves = [tree.left.left, tree.left.right, tree.right]
print("Root:", tree.value)
print("Children:", tree.left.value, tree.right.value)
print("Leaves:", " ".join(str(n.value) for n in leaves))
