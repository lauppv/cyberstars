def insert(tree, value):
    if tree is None:
        return [value, None, None]
    if value < tree[0]:
        tree[1] = insert(tree[1], value)
    else:
        tree[2] = insert(tree[2], value)
    return tree


def inorder(tree, out):
    if tree:
        inorder(tree[1], out)
        out.append(tree[0])
        inorder(tree[2], out)
    return out


def height(tree):
    return -1 if tree is None else 1 + max(height(tree[1]), height(tree[2]))


def search(tree, target):
    if tree is None:
        return False
    if tree[0] == target:
        return True
    return search(tree[1] if target < tree[0] else tree[2], target)


values = [50, 30, 70, 20, 40, 60, 80]
target = 60

root = None
for v in values:
    root = insert(root, v)
print("Sorted:", *inorder(root, []))
print("Height:", height(root))
print(f"Search {target}:", "found" if search(root, target) else "not found")
