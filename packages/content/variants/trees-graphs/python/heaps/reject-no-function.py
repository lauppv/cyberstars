values = [5, 3, 8, 1, 9, 6]
pops = 2

heap = []
for value in values:
    heap.append(value)
    i = len(heap) - 1
    while i > 0 and heap[i] < heap[(i - 1) // 2]:
        parent = (i - 1) // 2
        heap[i], heap[parent] = heap[parent], heap[i]
        i = parent
print("Heap:", *heap)

popped = []
for k in range(pops):
    popped.append(heap[0])
    last = heap.pop()
    if heap:
        heap[0] = last
        i = 0
        while True:
            child = i
            for c in (2 * i + 1, 2 * i + 2):
                if c < len(heap) and heap[c] < heap[child]:
                    child = c
            if child == i:
                break
            heap[i], heap[child] = heap[child], heap[i]
            i = child
print("Popped:", *popped)
print("Left:", *heap)
