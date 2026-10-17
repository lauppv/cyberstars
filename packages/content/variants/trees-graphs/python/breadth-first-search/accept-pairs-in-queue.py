from collections import deque

count, edges = map(int, input().split())
neighbours = {v: set() for v in range(count)}
for k in range(edges):
    a, b = map(int, input().split())
    neighbours[a].add(b)
    neighbours[b].add(a)
source, target = map(int, input().split())

found = {source: 0}
waiting = deque([(source, 0)])
while waiting:
    here, steps = waiting.popleft()
    for there in sorted(neighbours[here]):
        if there not in found:
            found[there] = steps + 1
            waiting.append((there, steps + 1))

for v in range(count):
    print(f"{v}: {found.get(v, -1)}")
if target in found:
    print(f"Fewest steps from {source} to {target}: {found[target]}")
else:
    print(f"No way from {source} to {target}")
