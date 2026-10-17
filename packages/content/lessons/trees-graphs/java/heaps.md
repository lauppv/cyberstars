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
- its parent is at index **(i - 1) / 2**, an `int` division that drops the remainder

**3** is at index 1, so its children are at 3 and 4: **5** and **9**. **8** is at index 5, so its parent is at (5 - 1) / 2 = 2: **6**. An index past the end of the list is a child that isn't there

The heap grows and shrinks, so an `ArrayList<Integer>` suits it better than an array: **add** puts a value at the end and **remove** takes one away, and the list keeps its own size

---

**Pushing** a value has to keep both the shape and the rule. The shape decides where it goes: the next free spot, which is the end of the list. Then the rule is fixed by **sifting up**: as long as the new value is smaller than its parent, swap the two

Pushing **2** into the heap above

```visual
{"use": "heap-push"}
```

It climbs one level per swap, so it never takes more steps than the tree is high. A small **swap** method keeps the swaps short

```java
import java.util.ArrayList;

public class Main {
    static void swap(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static void heapPush(ArrayList<Integer> heap, int value) {
        heap.add(value);
        int i = heap.size() - 1;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap.get(i) < heap.get(parent)) {
                swap(heap, i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }

    public static void main(String[] args) {
        ArrayList<Integer> heap = new ArrayList<>();
        int[] values = {5, 3, 8, 1, 9, 6};
        for (int value : values) {
            heapPush(heap, value);
        }
        System.out.println(heap);
    }
}
```

Output **[1, 3, 6, 5, 9, 8]**

That's the heap from the start of the lesson, built from values that came in mixed up

---

**Popping** takes out the root, the smallest value. The hole it leaves is filled with the **last** value of the list, so the shape stays whole. That value is probably too large for the top, so it **sifts down**: as long as one of its children is smaller than it, swap it with the **smaller** child. Swapping with the smaller one is what keeps the rule: it becomes the parent of the other child, and it's smaller than that one too

Popping from **1 3 2 5 9 8 6**

```visual
{"use": "heap-pop"}
```

```java
import java.util.ArrayList;

public class Main {
    static void swap(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static int heapPop(ArrayList<Integer> heap) {
        int smallest = heap.get(0);
        int last = heap.remove(heap.size() - 1);
        if (heap.size() > 0) {
            heap.set(0, last);
            int i = 0;
            while (true) {
                int left = 2 * i + 1;
                int right = 2 * i + 2;
                int child = i;
                if (left < heap.size() && heap.get(left) < heap.get(child)) {
                    child = left;
                }
                if (right < heap.size() && heap.get(right) < heap.get(child)) {
                    child = right;
                }
                if (child == i) {
                    break;
                }
                swap(heap, i, child);
                i = child;
            }
        }
        return smallest;
    }

    public static void main(String[] args) {
        ArrayList<Integer> heap = new ArrayList<>();
        int[] values = {1, 3, 2, 5, 9, 8, 6};
        for (int value : values) {
            heap.add(value);
        }
        System.out.println(heapPop(heap));
        System.out.println(heap);
    }
}
```

Output

```text
1
[2, 3, 6, 5, 9, 8]
```

**child** starts out as **i** itself and ends up as whichever of the three is smallest. If that's still **i**, both children are larger and the value has found its place. **heap.remove(heap.size() - 1)** takes the last value out and gives it back, so the list is one shorter before the sifting starts

---

Push everything, then pop until the heap is empty, and the values come out smallest first

```java
import java.util.ArrayList;

public class Main {
    static void swap(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static void heapPush(ArrayList<Integer> heap, int value) {
        heap.add(value);
        int i = heap.size() - 1;
        while (i > 0) {
            int parent = (i - 1) / 2;
            if (heap.get(i) < heap.get(parent)) {
                swap(heap, i, parent);
                i = parent;
            } else {
                break;
            }
        }
    }

    static int heapPop(ArrayList<Integer> heap) {
        int smallest = heap.get(0);
        int last = heap.remove(heap.size() - 1);
        if (heap.size() > 0) {
            heap.set(0, last);
            int i = 0;
            while (true) {
                int left = 2 * i + 1;
                int right = 2 * i + 2;
                int child = i;
                if (left < heap.size() && heap.get(left) < heap.get(child)) {
                    child = left;
                }
                if (right < heap.size() && heap.get(right) < heap.get(child)) {
                    child = right;
                }
                if (child == i) {
                    break;
                }
                swap(heap, i, child);
                i = child;
            }
        }
        return smallest;
    }

    public static void main(String[] args) {
        ArrayList<Integer> heap = new ArrayList<>();
        int[] values = {5, 3, 8, 1, 9, 6};
        for (int value : values) {
            heapPush(heap, value);
        }

        while (heap.size() > 0) {
            System.out.print(heapPop(heap) + " ");
        }
        System.out.println();
    }
}
```

Output **1 3 5 6 8 9**

That's **heap sort**. A push or a pop walks at most one path from top to bottom, and a heap is as low as a tree with that many nodes can be, so it stays fast even with millions of values

---

Java ships a heap too: **PriorityQueue** in **java.util** is a min-heap, with **add** to push and **poll** to pop. It does what your two methods do. In your own programs you'd reach for it; here you build it, to see how it works inside

---

## Mission: Run a Heap

1. Start **main** with two variables: **values**, an `int` array, and **pops**, an `int`. For example `int[] values = {5, 3, 8, 1, 9, 6};` and `int pops = 2;`
2. Write a method that pushes a value into a min-heap kept in a list, sifting it up, and a method that pops the smallest value, sifting the last one down
3. Starting from an empty list, push the values one at a time, in the order of the array, and print **Heap:** and the list's values, in order
4. Pop **pops** times, and print **Popped:** and the values you took out, in the order you took them
5. Print **Left:** and the values still in the list, in order

Use your own methods, not **PriorityQueue** and not sorting

**values** holds from 2 to 7 numbers, all different, each from -1000 to 1000. **pops** is at least 1 and smaller than the number of values

**Example** for values = {5, 3, 8, 1, 9, 6} and pops = 2

```text
Heap: 1 3 6 5 9 8
Popped: 1 3
Left: 5 8 6 9
```

**Example** for values = {40, 30, 20, 10} and pops = 1

```text
Heap: 10 20 30 40
Popped: 10
Left: 20 40 30
```
