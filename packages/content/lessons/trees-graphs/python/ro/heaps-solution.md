```py
def heap_adauga(heap, valoare):
    heap.append(valoare)
    i = len(heap) - 1
    while i > 0:
        parinte = (i - 1) // 2
        if heap[i] < heap[parinte]:
            heap[i], heap[parinte] = heap[parinte], heap[i]
            i = parinte
        else:
            break


def heap_extrage(heap):
    minim = heap[0]
    ultima = heap.pop()
    if len(heap) > 0:
        heap[0] = ultima
        i = 0
        while True:
            stang = 2 * i + 1
            drept = 2 * i + 2
            copil = i
            if stang < len(heap) and heap[stang] < heap[copil]:
                copil = stang
            if drept < len(heap) and heap[drept] < heap[copil]:
                copil = drept
            if copil == i:
                break
            heap[i], heap[copil] = heap[copil], heap[i]
            i = copil
    return minim


valori = [5, 3, 8, 1, 9, 6]
extrageri = 2

heap = []
for valoare in valori:
    heap_adauga(heap, valoare)

print("Heap:", end=" ")
for valoare in heap:
    print(valoare, end=" ")
print()

print("Extrase:", end=" ")
for i in range(extrageri):
    print(heap_extrage(heap), end=" ")
print()

print("Ramase:", end=" ")
for valoare in heap:
    print(valoare, end=" ")
print()
```
