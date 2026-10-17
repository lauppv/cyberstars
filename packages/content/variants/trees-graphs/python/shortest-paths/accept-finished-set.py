from heapq import heappush, heappop

size, edges = map(int, input().split())
roads = {v: {} for v in range(size)}
for k in range(edges):
    a, b, length = map(int, input().split())
    roads[a][b] = length
    roads[b][a] = length
source = int(input())

best = {}
frontier = [(0, source)]
while frontier:
    far, here = heappop(frontier)
    if here in best:
        continue
    best[here] = far
    for there, length in roads[here].items():
        if there not in best:
            heappush(frontier, (far + length, there))

for v in range(size):
    print(f"{v}: {best.get(v, -1)}")
