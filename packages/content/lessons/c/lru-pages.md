FIFO throws out the oldest page, even when it's used all the time. A better guess about the future is the recent past: a page used a moment ago will probably be used again soon. **LRU**, "least recently used", throws out the page that has gone the longest **without being used**

---

To know that, we remember for every frame **when its page was last used**: a counter that goes up with every access. On a hit, the page's time is refreshed. On a fault with all frames full, the victim is the frame with the smallest time

The same pages as in the FIFO lesson, 3 frames

```text
7: 7 - - fault
0: 7 0 - fault
1: 7 0 1 fault
2: 2 0 1 fault
0: 2 0 1 hit
3: 2 0 3 fault
0: 2 0 3 hit
4: 4 0 3 fault
```

When 3 comes, FIFO threw out 0, because 0 was old. LRU sees that 0 was just used, and throws out 1 instead. So the next 0 is a hit. Here LRU makes 6 faults where FIFO made 7

---

The best possible rule would be to throw out the page that will be needed **furthest in the future**. It's called **OPT**, the optimal algorithm. No real system can use it, because nobody knows the future. But in exercises it's the yardstick: a good algorithm gets close to OPT, and LRU usually does

Keeping an exact time for every page on every memory access would be too slow for real hardware. So real systems use cheaper tricks that come close to LRU, like a single "used" bit per page that the hardware sets and the kernel clears now and then

---

## Mission: LRU Replacement

Simulate LRU page replacement, in the same format as the FIFO lesson

1. Read the number of frames F, then page numbers until the input ends
2. For every page, print the page, the frames in slot order with `-` for an empty one, and `fault` or `hit`
3. While there are empty frames, a new page takes the first empty one. After that, it takes the slot of the page that was used least recently. A hit counts as a use
4. At the end, print the number of faults and of hits

F is from 1 to 7. Pages are from 0 to 99, and there are from 1 to 200 of them

**Example**

Input

```text
3
7 0 1 2 0 3 0 4
```

Output

```text
7: 7 - - fault
0: 7 0 - fault
1: 7 0 1 fault
2: 2 0 1 fault
0: 2 0 1 hit
3: 2 0 3 fault
0: 2 0 3 hit
4: 4 0 3 fault
Faults: 6, hits: 2
```
