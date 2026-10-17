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
print("Root: 8")
print("Children: 3 10")
print("Leaves: 1 6 10")
