from collections import deque
from heapq import heappop, heappush

size, edges = map(int, input().split())
road = [[0] * size for _ in range(size)]
for _ in range(edges):
    a, b, length = map(int, input().split())
    road[a][b] = road[b][a] = length
home = int(input())


def flood(v, label, tag):
    tag[v] = label
    for x in range(size):
        if road[v][x] and tag[x] is None:
            flood(x, label, tag)


tag = [None] * size
groups = 0
for v in range(size):
    if tag[v] is None:
        flood(v, groups, tag)
        groups += 1

hops = {home: 0}
line = deque([home])
while line:
    v = line.popleft()
    for x in range(size):
        if road[v][x] and x not in hops:
            hops[x] = hops[v] + 1
            line.append(x)

best = {}
todo = [(0, home)]
while todo:
    far, v = heappop(todo)
    if v in best:
        continue
    best[v] = far
    for x in range(size):
        if road[v][x] and x not in best:
            heappush(todo, (far + road[v][x], x))

print("Pieces: " + str(groups))
print("Steps: " + " ".join(str(hops.get(v, -1)) for v in range(size)))
print("Distances: " + " ".join(str(best.get(v, -1)) for v in range(size)))
