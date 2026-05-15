Computers think in **bits** — 0s and 1s. C lets us work directly with those bits using **bitwise operators**. This is as low-level as it gets without writing assembly

The number **13** in binary is **1101**. The number **10** is **1010**. Bitwise operators work on each bit individually

---

**& (AND)** — both bits must be 1
```c
#include <stdio.h>

int main(void) {
    int a = 13;   // 1101
    int b = 10;   // 1010
    printf("%d\n", a & b);   // 8 (1000)
    return 0;
}
```
```text
  1101  (13)
& 1010  (10)
------
  1000  (8)
```
Each position: if both are 1, result is 1. Otherwise 0

---

**| (OR)** — at least one bit must be 1
```c
printf("%d\n", 13 | 10);   // 15
```
```text
  1101  (13)
| 1010  (10)
------
  1111  (15)
```

**^ (XOR)** — exactly one bit must be 1
```c
printf("%d\n", 13 ^ 10);   // 7
```
```text
  1101  (13)
^ 1010  (10)
------
  0111  (7)
```

**~ (NOT)** — flip every bit
```c
printf("%d\n", ~0);   // -1 (all bits become 1)
```

---

**Shift operators** move bits left or right

**<< (left shift)** — shift bits left, fill with 0s. Each left shift **multiplies by 2**
```c
printf("%d\n", 5 << 1);   // 10  (101 -> 1010)
printf("%d\n", 5 << 2);   // 20  (101 -> 10100)
printf("%d\n", 1 << 3);   // 8   (1 -> 1000)
```

**>> (right shift)** — shift bits right. Each right shift **divides by 2**
```c
printf("%d\n", 20 >> 1);   // 10
printf("%d\n", 20 >> 2);   // 5
```

**1 << n** gives us **2^n**. This is one of the most common tricks in programming

---

A classic use: **flags**. Imagine a game character with abilities
```c
#define CAN_FLY    (1 << 0)   // 0001 = 1
#define CAN_SWIM   (1 << 1)   // 0010 = 2
#define CAN_FIGHT  (1 << 2)   // 0100 = 4
#define CAN_HEAL   (1 << 3)   // 1000 = 8

int abilities = CAN_FLY | CAN_FIGHT;   // 0101 = 5

// check if can fly
if (abilities & CAN_FLY) {
    printf("Can fly!\n");
}

// add swim ability
abilities = abilities | CAN_SWIM;       // 0111 = 7

// remove fly ability
abilities = abilities & ~CAN_FLY;       // 0110 = 6
```

A single **int** stores multiple yes/no properties using individual bits. This is used in operating systems, network protocols, and game engines. Linux file permissions work exactly like this

---

Given two integers **a = 12** (binary: 1100) and **b = 10** (binary: 1010), print:
1. **a & b** (AND)
2. **a | b** (OR)
3. **a ^ b** (XOR)
4. **a << 2** (left shift by 2)

Expected output
```text
8
14
6
48
```
