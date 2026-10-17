from collections import deque

a = 1
b = 2
c = 3
d = 4
e = 5
f = 6
g = 7

tree = {"v": a, "l": {"v": b, "l": {"v": d}}, "r": {"v": c, "l": {"v": e, "r": {"v": g}}, "r": {"v": f}}}
queue = deque([tree])
level = 0
while queue:
    values = []
    for i in range(len(queue)):
        node = queue.popleft()
        values.append(str(node["v"]))
        for side in ("l", "r"):
            if side in node:
                queue.append(node[side])
    print(f"Level {level}: " + " ".join(values))
    level += 1
