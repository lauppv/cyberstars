def heap_push(heap, value):
    heap.append(value)
    i = len(heap) - 1
    while i > 0:
        parent = (i - 1) // 2
        if heap[i] < heap[parent]:
            heap[i], heap[parent] = heap[parent], heap[i]
            i = parent
        else:
            break


def heap_pop(heap):
    smallest = heap[0]
    last = heap.pop()
    if len(heap) > 0:
        heap[0] = last
        i = 0
        while True:
            left = 2 * i + 1
            right = 2 * i + 2
            child = i
            if left < len(heap) and heap[left] < heap[child]:
                child = left
            if right < len(heap) and heap[right] < heap[child]:
                child = right
            if child == i:
                break
            heap[i], heap[child] = heap[child], heap[i]
            i = child
    return smallest


values = [5, 3, 8, 1, 9, 6]
pops = 2

heap = []
for value in values:
    heap_push(heap, value)

print("Heap:", end=" ")
for value in heap:
    print(value, end=" ")
print()

print("Popped:", end=" ")
for value in sorted(heap)[:pops]:
    print(value, end=" ")
for i in range(pops):
    heap_pop(heap)
print()

print("Left:", end=" ")
for value in heap:
    print(value, end=" ")
print()
