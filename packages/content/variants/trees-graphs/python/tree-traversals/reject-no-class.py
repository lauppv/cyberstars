def pre(t):
    if t is None:
        return []
    return [t[0]] + pre(t[1]) + pre(t[2])


def mid(t):
    if t is None:
        return []
    return mid(t[1]) + [t[0]] + mid(t[2])


def post(t):
    if t is None:
        return []
    return post(t[1]) + post(t[2]) + [t[0]]


a = 1
b = 2
c = 3
d = 4
e = 5
f = 6
g = 7

tree = (a, (b, (d, None, None), (e, (g, None, None), None)), (c, None, (f, None, None)))
print("Preorder:", *pre(tree))
print("Inorder:", *mid(tree))
print("Postorder:", *post(tree))
