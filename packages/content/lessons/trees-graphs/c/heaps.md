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

That shape means a heap needs no nodes, no pointers and no **malloc**. Read it level by level, left to right, into a plain array

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
- its parent is at index **(i - 1) / 2**

**3** is at index 1, so its children are at 3 and 4: **5** and **9**. **8** is at index 5, so its parent is at (5 - 1) / 2 = 2: **6**. Dividing two ints drops the remainder, which is exactly what the parent needs: (6 - 1) / 2 is 2 as well. An index at or past the heap's **size** is a child that isn't there

The array has a fixed length, so the heap keeps its own **size**, the number of values in it, next to the array. The spots past **size** are free room

---

**Pushing** a value has to keep both the shape and the rule. The shape decides where it goes: the next free spot, which is index **size**. Then the rule is fixed by **sifting up**: as long as the new value is smaller than its parent, swap the two

Pushing **2** into the heap above

```text
put 2 at index 6, the right child of 6

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

**heap_push** changes the size, so it gets a pointer to it, `int *size`, and writes through it

```c
#include <stdio.h>

void heap_push(int heap[], int *size, int value) {
    heap[*size] = value;
    int i = *size;
    *size = *size + 1;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[i] < heap[parent]) {
            int temp = heap[i];
            heap[i] = heap[parent];
            heap[parent] = temp;
            i = parent;
        } else {
            break;
        }
    }
}

int main(void) {
    int heap[10];
    int size = 0;
    int values[] = {5, 3, 8, 1, 9, 6};
    for (int i = 0; i < 6; i++) {
        heap_push(heap, &size, values[i]);
    }
    for (int i = 0; i < size; i++) {
        printf("%d ", heap[i]);
    }
    printf("\n");
    return 0;
}
```

Output **1 3 6 5 9 8**

That's the heap from the start of the lesson, built from values that came in mixed up

---

**Popping** takes out the root, the smallest value. The hole it leaves is filled with the **last** value of the heap, so the shape stays whole. That value is probably too large for the top, so it **sifts down**: as long as one of its children is smaller than it, swap it with the **smaller** child. Swapping with the smaller one is what keeps the rule: it becomes the parent of the other child, and it's smaller than that one too

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

```c
#include <stdio.h>

int heap_pop(int heap[], int *size) {
    int smallest = heap[0];
    *size = *size - 1;
    heap[0] = heap[*size];
    int i = 0;
    while (1) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int child = i;
        if (left < *size && heap[left] < heap[child]) {
            child = left;
        }
        if (right < *size && heap[right] < heap[child]) {
            child = right;
        }
        if (child == i) {
            break;
        }
        int temp = heap[i];
        heap[i] = heap[child];
        heap[child] = temp;
        i = child;
    }
    return smallest;
}

int main(void) {
    int heap[10] = {1, 3, 2, 5, 9, 8, 6};
    int size = 7;
    printf("%d\n", heap_pop(heap, &size));
    for (int i = 0; i < size; i++) {
        printf("%d ", heap[i]);
    }
    printf("\n");
    return 0;
}
```

Output

```text
1
2 3 6 5 9 8
```

**child** starts out as **i** itself and ends up as whichever of the three is smallest. If that's still **i**, both children are larger and the value has found its place

---

Push everything, then pop until the heap is empty, and the values come out smallest first

```c
#include <stdio.h>

void heap_push(int heap[], int *size, int value) {
    heap[*size] = value;
    int i = *size;
    *size = *size + 1;
    while (i > 0) {
        int parent = (i - 1) / 2;
        if (heap[i] < heap[parent]) {
            int temp = heap[i];
            heap[i] = heap[parent];
            heap[parent] = temp;
            i = parent;
        } else {
            break;
        }
    }
}

int heap_pop(int heap[], int *size) {
    int smallest = heap[0];
    *size = *size - 1;
    heap[0] = heap[*size];
    int i = 0;
    while (1) {
        int left = 2 * i + 1;
        int right = 2 * i + 2;
        int child = i;
        if (left < *size && heap[left] < heap[child]) {
            child = left;
        }
        if (right < *size && heap[right] < heap[child]) {
            child = right;
        }
        if (child == i) {
            break;
        }
        int temp = heap[i];
        heap[i] = heap[child];
        heap[child] = temp;
        i = child;
    }
    return smallest;
}

int main(void) {
    int heap[10];
    int size = 0;
    int values[] = {5, 3, 8, 1, 9, 6};
    for (int i = 0; i < 6; i++) {
        heap_push(heap, &size, values[i]);
    }
    while (size > 0) {
        printf("%d ", heap_pop(heap, &size));
    }
    printf("\n");
    return 0;
}
```

Output **1 3 5 6 8 9**

That's **heap sort**. A push or a pop walks at most one path from top to bottom, and a heap is as low as a tree with that many nodes can be, so it stays fast even with millions of values

---

C's standard library has no heap, so in C you'd write these two functions yourself, just as you did here. Many other languages ship one: Python has **heapq** and Java has **PriorityQueue**, and inside they do what your two functions do

---

## Mission: Run a Heap

1. Read the input with **scanf**: on the first line **n**, how many values there are, on the second line the **n** values, and on the third line **pops**, how many values to pop
2. Write a function that pushes a value into a min-heap kept in an array, sifting it up, and a function that pops the smallest value, sifting the last one down
3. Starting from an empty heap, push the values one at a time, in the order they were read, and print **Heap:** and the heap's values, in array order
4. Pop **pops** times, and print **Popped:** and the values you took out, in the order you took them
5. Print **Left:** and the values still in the heap, in array order

Use your own functions, not sorting

**n** is from 2 to 7, the values are all different, each from -1000 to 1000, and **pops** is at least 1 and smaller than **n**

**Example**

Input

```text
6
5 3 8 1 9 6
2
```

Output

```text
Heap: 1 3 6 5 9 8
Popped: 1 3
Left: 5 8 6 9
```

**Example**

Input

```text
4
40 30 20 10
1
```

Output

```text
Heap: 10 20 30 40
Popped: 10
Left: 20 40 30
```
