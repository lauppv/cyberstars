```py
def mirror(root):
    if root is not None:
        root.left, root.right = mirror(root.right), mirror(root.left)
    return root
```
