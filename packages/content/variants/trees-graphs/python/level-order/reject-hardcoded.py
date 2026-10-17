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

print("Level 0:", a)
print("Level 1:", b, c)
print("Level 2:", d, e, f)
print("Level 3:", g)
