class Node:
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right


def pre(n):
    return [] if n is None else [n.value] + pre(n.left) + pre(n.right)


def mid(n):
    return [] if n is None else mid(n.left) + [n.value] + mid(n.right)


def post(n):
    return [] if n is None else post(n.left) + post(n.right) + [n.value]


a = 1
b = 2
c = 3
d = 4
e = 5
f = 6
g = 7

tree = Node(a, Node(b, Node(d), Node(e, Node(g))), Node(c, None, Node(f)))
print("Preorder: " + " ".join(str(v) for v in pre(tree)))
print("Inorder: " + " ".join(str(v) for v in mid(tree)))
print("Postorder: " + " ".join(str(v) for v in post(tree)))
