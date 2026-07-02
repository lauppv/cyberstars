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

At each position: if both are 1, the result is 1. Otherwise 0

---

**| (OR)** — at least one bit must be 1

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 13 | 10);   // 15
    return 0;
}
```

```text
  1101  (13)
| 1010  (10)
------
  1111  (15)
```

**^ (XOR)** — exactly one bit must be 1

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 13 ^ 10);   // 7
    return 0;
}
```

```text
  1101  (13)
^ 1010  (10)
------
  0111  (7)
```

**~ (NOT)** — flips every bit

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", ~0);   // -1 (all bits become 1)
    return 0;
}
```

---

**Shift operators** move bits left or right

**<< (left shift)** — shifts bits left, filling with 0s. Each left shift **multiplies by 2**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 5 << 1);   // 10  (101 -> 1010)
    printf("%d\n", 5 << 2);   // 20  (101 -> 10100)
    printf("%d\n", 1 << 3);   // 8   (1 -> 1000)
    return 0;
}
```

**>> (right shift)** — shifts bits right. Each right shift **divides by 2**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 20 >> 1);   // 10
    printf("%d\n", 20 >> 2);   // 5
    return 0;
}
```

**1 << n** gives us **2^n**. This is one of the most used tricks in programming

---

A classic use case: **permission flags**, exactly like they work on UNIX files

```c
#include <stdio.h>

#define PERM_READ    (1 << 0)   // 001 = 1
#define PERM_WRITE   (1 << 1)   // 010 = 2
#define PERM_EXECUTE (1 << 2)   // 100 = 4

int main(void) {
    int permissions = PERM_READ | PERM_WRITE;   // 011 = 3

    // check if allowed to read
    if (permissions & PERM_READ) {
        printf("Can read\n");
    }

    // add execute permission
    permissions = permissions | PERM_EXECUTE;      // 111 = 7

    // remove write permission
    permissions = permissions & ~PERM_WRITE;       // 101 = 5

    return 0;
}
```

A single **int** stores multiple yes/no properties using individual bits. This is exactly what UNIX does when you run `ls -l` and see `rwx` next to a file — each letter is a bit in an integer

---

## Mission: Terminal access codes

The computing center checks pairs of security codes received from terminals. The shift operator enters two integers, and the system must print the four basic bitwise operations to confirm the configuration.

1. Read two integers **a** and **b**
2. Print **a & b** (AND)
3. Print **a | b** (OR)
4. Print **a ^ b** (XOR)
5. Print **a << 2** (left shift by 2)

**Example**

Input

```text
12 10
```

Output

```text
8
14
6
48
```

**Example**

Input

```text
5 3
```

Output

```text
1
7
6
20
```
