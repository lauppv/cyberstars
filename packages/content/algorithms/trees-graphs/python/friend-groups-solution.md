```py
# adj[u] lists the neighbours of vertex u.
def count_groups(adj):
    seen = [False] * len(adj)
    groups = 0
    for start in range(len(adj)):
        if seen[start]:
            continue
        groups += 1
        seen[start] = True
        stack = [start]
        while stack:
            u = stack.pop()
            for v in adj[u]:
                if not seen[v]:
                    seen[v] = True
                    stack.append(v)
    return groups
```
