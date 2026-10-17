class Node:
    def __init__(self, data):
        self.data = data
        self.kids = [None, None]


a = 8
b = 3
c = 10
d = 1
e = 6

top = Node(a)
top.kids[0] = Node(b)
top.kids[1] = Node(c)
top.kids[0].kids[0] = Node(d)
top.kids[0].kids[1] = Node(e)
print(f"Root: {top.data}")
print(f"Children: {top.kids[0].data} {top.kids[1].data}")
print(f"Leaves: {top.kids[0].kids[0].data} {top.kids[0].kids[1].data} {top.kids[1].data}")
