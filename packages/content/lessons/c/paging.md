Every process thinks it has a big, clean memory of its own, starting at address 0. That's an illusion the operating system builds, called **virtual memory**. The addresses a program uses are virtual. The hardware turns each one into a real, physical address in RAM, with the help of a table the kernel keeps for every process

---

Memory is cut into equal blocks. On the virtual side they're called **pages**, in real RAM they're called **frames**, and both have the same size, like 4096 bytes. The **page table** says, for each page of the process, which frame holds it

An address splits into two parts

- the **page number**: address / page size
- the **offset**, the place inside the page: address % page size

The physical address is then frame × page size + offset

```text
page size 1000, page table: page 0 -> frame 5, page 1 -> frame 2

address 1234  ->  page 1, offset 234  ->  frame 2  ->  2 * 1000 + 234 = 2234
```

The offset never changes. Only the page part is swapped for a frame

---

Real page sizes are powers of 2, like 4096 = 2^12. Then dividing and taking the rest are just bit operations, which the hardware does instantly

```c
#include <stdio.h>

int main(void) {
    unsigned address = 13000;
    unsigned page = address >> 12;
    unsigned offset = address & 4095;
    printf("page %u, offset %u\n", page, offset);
    return 0;
}
```

Output

```text
page 3, offset 712
```

**unsigned** is a whole number that is never negative, printed with %u. Addresses are never negative, so it fits them well. Shifting right by 12 is the same as dividing by 4096. And 4095 is twelve 1 bits, so `& 4095` keeps exactly the last 12 bits, which is the rest of the division

---

Not every page has to be in RAM. A page that is on the disk, or that was never used, has no frame: its entry is marked **not present**. When the program touches such a page, the hardware stops and calls the kernel: that's a **page fault**. The kernel loads the page from the disk into a free frame, fixes the table, and lets the program go on, which never notices anything. That's how programs can use more memory than the RAM really has

---

## Mission: The Address Translator

Build the translation the hardware does for every memory access

1. Read the page size, a power of 2, and the number of pages n. Then the page table: n numbers, where entry p is the frame of page p, or -1 if the page is not present
2. Read virtual addresses until the input ends. For each one, find the page number and the offset with shifts and masks, not with / and %
3. Print the translation as in the example. If the page doesn't exist in the table, or is not present, print `page fault` instead of the physical address
4. At the end, print how many accesses caused a page fault

The page size is from 16 to 65536. n is from 1 to 64. Frames are from 0 to 1000, and addresses from 0 to 10000000

**Example**

Input

```text
1024 4
5 -1 2 7
100 1500 2100 5000
```

Output

```text
100: page 0, offset 100 -> 5220
1500: page 1, offset 476 -> page fault
2100: page 2, offset 52 -> 2100
5000: page 4, offset 904 -> page fault
Page faults: 2
```

The table has pages 0 to 3, so page 4 doesn't belong to the process at all
