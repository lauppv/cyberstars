Address translation, page faults and LRU replacement together: a small virtual memory, the way a kernel runs one

---

## Mission: The Virtual Memory

The mainframe gives a program only a few frames of real memory, and loads pages when they're needed. Simulate it: translate every address, load pages on faults, and throw out the least recently used page when memory is full

1. Read the page size, a power of 2, and the number of frames F. Then read virtual addresses until the input ends
2. For each address, find its page and offset with shifts and masks
3. If the page is in memory, it's a hit. If not, it's a fault: the page gets the free frame with the smallest number, or, when there's no free frame, the frame of the least recently used page, which is thrown out. Every access counts as a use
4. Print one line per access, as in the example, with the physical address at the end. Then print the number of faults and of hits

The page size is from 16 to 4096, F from 1 to 8, and addresses from 0 to 1000000. There are at most 500 addresses

**Example**

Input

```text
256 2
100 300 120 600 310 900 100
```

Output

```text
100: page 0, fault, frame 0 -> 100
300: page 1, fault, frame 1 -> 300
120: page 0, hit, frame 0 -> 120
600: page 2, fault, out page 1, frame 1 -> 344
310: page 1, fault, out page 0, frame 0 -> 54
900: page 3, fault, out page 2, frame 1 -> 388
100: page 0, fault, out page 1, frame 0 -> 100
Faults: 6, hits: 1
```
