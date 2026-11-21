RAM has a limited number of frames. When a page fault happens and every frame is full, the kernel must throw a page out to make room: it's written back to the disk if it changed, and its frame gets the new page. Which page should go? The rule is a **page replacement algorithm**, and a good one causes few page faults

We study them with a **reference string**: the list of pages a program touches, in order. And we count the faults for a given number of frames

---

The simplest rule is **FIFO**: throw out the page that came in first, the oldest one. We keep the frames as slots, and a pointer to the slot of the oldest page. A new page always goes into that slot, and the pointer moves to the next slot, in a circle

With 3 frames and the pages 7 0 1 2 0 3

```text
7: 7 - - fault
0: 7 0 - fault
1: 7 0 1 fault
2: 2 0 1 fault
0: 2 0 1 hit
3: 2 3 1 fault
```

A `-` is an empty frame. When 2 comes, all frames are full, and 7 is the oldest, so 2 takes its slot. 0 is already in memory: a **hit**, nothing changes. Then 3 replaces 0, the oldest of the ones left

---

It's easy, but it doesn't care whether a page is still used. An old page might be the most popular one. FIFO even has a famous oddity, **Belady's anomaly**: giving it more frames can cause **more** faults

```c
#include <stdio.h>

int fifo_faults(int refs[], int n, int frames) {
    int slot[8];
    int used = 0;
    int oldest = 0;
    int faults = 0;
    for (int i = 0; i < n; i++) {
        int found = 0;
        for (int s = 0; s < used; s++) {
            if (slot[s] == refs[i]) {
                found = 1;
            }
        }
        if (found) {
            continue;
        }
        faults++;
        if (used < frames) {
            slot[used] = refs[i];
            used++;
        } else {
            slot[oldest] = refs[i];
            oldest = (oldest + 1) % frames;
        }
    }
    return faults;
}

int main(void) {
    int refs[] = { 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 };
    printf("3 frames: %d faults\n", fifo_faults(refs, 12, 3));
    printf("4 frames: %d faults\n", fifo_faults(refs, 12, 4));
    return 0;
}
```

Output

```text
3 frames: 9 faults
4 frames: 10 faults
```

One more frame, one more fault. Algorithms that look at how pages are used, like the one in the next lesson, never do that

---

## Mission: FIFO Replacement

Simulate FIFO page replacement and show what's in memory after every access

1. Read the number of frames F, then page numbers until the input ends
2. For every page, print the page, the content of the frames in slot order with `-` for an empty one, and `fault` or `hit`, as in the example
3. While there are empty frames, a new page takes the first empty one. After that, it takes the slot of the oldest page
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
3: 2 3 1 fault
0: 2 3 0 fault
4: 4 3 0 fault
Faults: 7, hits: 1
```
