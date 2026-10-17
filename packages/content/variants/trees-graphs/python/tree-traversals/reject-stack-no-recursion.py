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
root.left.right = Node(e)
root.right.right = Node(f)
root.left.right.left = Node(g)

pre = []
stack = [root]
while stack:
    node = stack.pop()
    pre.append(node.value)
    if node.right:
        stack.append(node.right)
    if node.left:
        stack.append(node.left)

mid = []
stack = []
node = root
while stack or node:
    while node:
        stack.append(node)
        node = node.left
    node = stack.pop()
    mid.append(node.value)
    node = node.right

post = []
stack = [root]
while stack:
    node = stack.pop()
    post.append(node.value)
    if node.left:
        stack.append(node.left)
    if node.right:
        stack.append(node.right)
post.reverse()

print("Preorder:", *pre)
print("Inorder:", *mid)
print("Postorder:", *post)
