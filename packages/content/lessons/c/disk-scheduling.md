On an old hard disk, the data sits on circles called **cylinders**, numbered from the edge inwards, and an arm with a read head moves over them. Moving the arm is slow, much slower than reading. When many requests wait, the order in which the disk serves them decides how far the arm travels, and so how fast everything goes. Choosing that order is **disk scheduling**

We measure an algorithm by the **total head movement**: the sum of the distances between one cylinder and the next. **abs**, from stdlib.h, gives a distance without its sign: abs(37 - 53) is 16

---

The classic example. The head is at cylinder 53, and these requests wait, in the order they came

```text
98 183 37 122 14 124 65 67
```

**FCFS** serves them in that order. The head jumps from 53 to 98, then 183, then back to 37, and so on, back and forth across the whole disk. Total: 640 cylinders

---

**SSTF**, "shortest seek time first", always goes to the closest request next. It's the same idea as SJF

```text
53 -> 65 -> 67 -> 37 -> 14 -> 98 -> 122 -> 124 -> 183
```

Total: 236. Much better. But like SJF, it can starve: requests far away wait as long as closer ones keep coming

---

**LOOK** works like an elevator. The arm keeps going in one direction, serving every request on its way, until there are no more requests in that direction. Then it turns around and serves the others on the way back. Going up first

```text
53 -> 65 -> 67 -> 98 -> 122 -> 124 -> 183 -> 37 -> 14
```

Total: 299. A bit more than SSTF here, but no request waits forever: each one is reached on the next sweep at the latest. **SCAN** is the same, except the arm always goes all the way to the last cylinder before turning

---

## Mission: The Disk Arm

Compare three disk scheduling algorithms on the same requests

1. Read the starting cylinder of the head, then cylinder numbers until the input ends: the requests, in the order they came
2. For each algorithm, print its name, the order in which it serves the requests, and the total head movement, as in the example
   - **FCFS**: in the order they came
   - **SSTF**: always the closest next. When two are equally close, the smaller cylinder first
   - **LOOK**: first upwards, serving every request at or above the head in increasing order, then downwards, serving the rest in decreasing order

Cylinders are from 0 to 199. There are from 1 to 100 requests

**Example**

Input

```text
53
98 183 37 122 14 124 65 67
```

Output

```text
FCFS: 98 183 37 122 14 124 65 67, moved 640
SSTF: 65 67 37 14 98 122 124 183, moved 236
LOOK: 65 67 98 122 124 183 37 14, moved 299
```
