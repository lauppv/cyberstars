An emergency room doesn't treat patients in the order they came in. It treats the most urgent one first, then the most urgent of those left, and new patients keep arriving. A game picks the next event to happen, a computer the next task to run, a map app the nearest place it hasn't checked yet. Each time, all you need is the smallest of what's waiting, not the whole list sorted

That's a **priority queue**, and the structure behind it is a **heap**

---

A **min-heap** is a binary tree with one rule: every node is smaller than its children. In this lesson the values are all different, so "smaller" never has to deal with a tie

```text
          1
        /   \
       3     6
      / \   /
     5   9 8
```

Follow any path down and the values only grow, so the smallest value of all is always the root. Nothing is said about left and right: **3** is on the left and **6** on the right, but they could just as well be the other way round. A heap is not a binary search tree

A heap also keeps its **shape**: every level is full except maybe the last, and the last one fills from the left, with no gaps. The tree above is missing only the right child of **6**, the last spot of the last level

---

That shape means a heap needs no nodes at all. Read it level by level, left to right, into a plain list

```text
          1                 index:  0  1  2  3  4  5
        /   \               value:  1  3  6  5  9  8
       3     6
      / \   /
     5   9 8
```

The edges aren't lost, they're arithmetic. For the value at index **i**

- its left child is at index **2 \* i + 1**
- its right child is at index **2 \* i + 2**
- its parent is at index **(i - 1) // 2**

**3** is at index 1, so its children are at 3 and 4: **5** and **9**. **8** is at index 5, so its parent is at (5 - 1) // 2 = 2: **6**. An index past the end of the list is a child that isn't there

---

**Pushing** a value has to keep both the shape and the rule. The shape decides where it goes: the next free spot, which is the end of the list. Then the rule is fixed by **sifting up**: as long as the new value is smaller than its parent, swap the two

Pushing **2** into the heap above

```text
append 2 at index 6, the right child of 6

          1                 1  3  6  5  9  8  2
        /   \
       3     6
      / \   / \
     5   9 8   2

2 is smaller than its parent 6: swap them

          1                 1  3  2  5  9  8  6
        /   \
       3     2
      / \   / \
     5   9 8   6

2 is larger than its parent 1: stop
```

It climbs one level per swap, so it never takes more steps than the tree is high

```py
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


heap = []
for value in [5, 3, 8, 1, 9, 6]:
    heap_push(heap, value)
print(heap)
```

Output **[1, 3, 6, 5, 9, 8]**

That's the heap from the start of the lesson, built from values that came in mixed up

---

**Popping** takes out the root, the smallest value. The hole it leaves is filled with the **last** value of the list, so the shape stays whole. That value is probably too large for the top, so it **sifts down**: as long as one of its children is smaller than it, swap it with the **smaller** child. Swapping with the smaller one is what keeps the rule: it becomes the parent of the other child, and it's smaller than that one too

Popping from **1 3 2 5 9 8 6**

```text
take out 1, move the last value, 6, to the root

          6                 6  3  2  5  9  8
        /   \
       3     2
      / \   /
     5   9 8

6 has the children 3 and 2; the smaller is 2, and it's smaller than 6: swap

          2                 2  3  6  5  9  8
        /   \
       3     6
      / \   /
     5   9 8

6 has the child 8, larger than 6: stop
```

```py
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


heap = [1, 3, 2, 5, 9, 8, 6]
print(heap_pop(heap))
print(heap)
```

Output

```text
1
[2, 3, 6, 5, 9, 8]
```

**child** starts out as **i** itself and ends up as whichever of the three is smallest. If that's still **i**, both children are larger and the value has found its place

---

Push everything, then pop until the heap is empty, and the values come out smallest first

```py
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


heap = []
for value in [5, 3, 8, 1, 9, 6]:
    heap_push(heap, value)

while len(heap) > 0:
    print(heap_pop(heap), end=" ")
print()
```

Output **1 3 5 6 8 9**

That's **heap sort**. A push or a pop walks at most one path from top to bottom, and a heap is as low as a tree with that many nodes can be, so it stays fast even with millions of values

---

Python ships a heap too: the **heapq** module keeps a plain list as a min-heap, with **heapq.heappush** and **heapq.heappop**. It does what your two functions do. In your own programs you'd reach for it; here you build it, to see how it works inside

---

## Mission: Run a Heap

1. Start your program with two variables: **values**, a list of whole numbers, and **pops**, a whole number. For example `values = [5, 3, 8, 1, 9, 6]` and `pops = 2`
2. Write a function that pushes a value into a min-heap kept in a list, sifting it up, and a function that pops the smallest value, sifting the last one down
3. Starting from an empty list, push the values one at a time, in the order of the list, and print **Heap:** and the list's values, in order
4. Pop **pops** times, and print **Popped:** and the values you took out, in the order you took them
5. Print **Left:** and the values still in the list, in order

Use your own functions, not **heapq** and not sorting

**values** holds from 2 to 7 numbers, all different, each from -1000 to 1000. **pops** is at least 1 and smaller than the number of values

**Example** for values = [5, 3, 8, 1, 9, 6] and pops = 2

```text
Heap: 1 3 6 5 9 8
Popped: 1 3
Left: 5 8 6 9
```

**Example** for values = [40, 30, 20, 10] and pops = 1

```text
Heap: 10 20 30 40
Popped: 10
Left: 20 40 30
```
