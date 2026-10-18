```py
def print_levels(root):
    if root is None:
        return
    queue = deque([root])
    while queue:
        values = []
        for _ in range(len(queue)):
            node = queue.popleft()
            values.append(str(node.value))
            if node.left is not None:
                queue.append(node.left)
            if node.right is not None:
                queue.append(node.right)
        print(" ".join(values))
```
