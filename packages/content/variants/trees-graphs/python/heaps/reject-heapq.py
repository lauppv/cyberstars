import heapq

values = [5, 3, 8, 1, 9, 6]
pops = 2


def show(label, items):
    print(label, *items)


heap = []
for v in values:
    heapq.heappush(heap, v)
show("Heap:", heap)
show("Popped:", [heapq.heappop(heap) for _ in range(pops)])
show("Left:", heap)
