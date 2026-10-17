import sys

tokens = sys.stdin.read().split()
size, edge_count = int(tokens[0]), int(tokens[1])
links = {v: set() for v in range(size)}
for k in range(edge_count):
    a, b = int(tokens[2 + 2 * k]), int(tokens[3 + 2 * k])
    links[a].add(b)
    links[b].add(a)


def gather(v, group):
    group.add(v)
    for w in links[v] - group:
        if w not in group:
            gather(w, group)
    return group


groups = []
left = set(range(size))
while left:
    group = gather(min(left), set())
    groups.append(sorted(group))
    left -= group
print("Pieces:", len(groups))
for i, group in enumerate(groups, 1):
    print(f"Piece {i}: " + " ".join(map(str, group)))
