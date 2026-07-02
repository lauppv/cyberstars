So far, every variable held **one** single thing. But what if we want to store the hourly power draw of a magnetic tape drive over several hours? Five separate variables would be ugly. Fifty would be impossible. We need an **array**

An **array** in C is a fixed-size collection of values of the **same type**

```c
#include <stdio.h>

int main(void) {
    int draw[5] = { 80, 95, 60, 72, 88 };

    printf("%d\n", draw[0]);   // 80
    printf("%d\n", draw[1]);   // 95
    printf("%d\n", draw[4]);   // 88

    return 0;
}
```

The form is **type name[size]**. We declared **draw** as an array of **5 ints**, then filled it with **{ ... }**

**Counting starts at 0**. **draw[0]** is the first element, **draw[4]** is the last one (because the size is 5, indices are 0-4)

---

We can let C **infer the size** from the initializer

```c
#include <stdio.h>

int main(void) {
    int draw[] = { 80, 95, 60, 72, 88 };
    return 0;
}
```

The square brackets are still empty, but the array still has size **5**. C counts the values for us. It's shorter and harder to typo

We can also create an array **without** initializing it, then fill it later

```c
#include <stdio.h>

int main(void) {
    int draw[5];
    draw[0] = 80;
    draw[1] = 95;
    draw[2] = 60;
    draw[3] = 72;
    draw[4] = 88;
    return 0;
}
```

**Warning**: until we assign values, the array holds **garbage** (whatever was in that memory before). Reading from an uninitialized array is **undefined behavior** in C — your program might print **0**, or random numbers, or crash. Always initialize before reading

---

How many elements does an array have? Here C gives us no help at all — the array doesn't **know** its own size, it's just a chunk of memory

The classic trick uses **sizeof**

```c
#include <stdio.h>

int main(void) {
    int draw[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(draw) / sizeof(draw[0]);
    printf("%d\n", n);   // 5
    return 0;
}
```

**sizeof(draw)** gives the total number of bytes of the array, **sizeof(draw[0])** gives the number of bytes of one element. Dividing them gives us the number of elements

**Big trap**: this trick only works on the **original** array. The moment you **pass an array to a function**, C silently converts it to a pointer, and **sizeof** gives a different (wrong) result. So in practice, when we write functions that take arrays, we **pass the size as a separate parameter**. We'll see that in the next lesson

---

We can change values exactly like with any normal variable

```c
#include <stdio.h>

int main(void) {
    int draw[5] = { 80, 95, 60, 72, 88 };
    draw[1] = 100;
    printf("%d\n", draw[1]);   // 100
    return 0;
}
```

---

What happens if we ask for an index that doesn't exist?

```c
#include <stdio.h>

int main(void) {
    int draw[5] = { 80, 95, 60, 72, 88 };
    printf("%d\n", draw[10]);
    return 0;
}
```

Run it. **C does NOT check** whether the index is valid. C simply reads whatever happens to be at that memory location. You might see **0**, or random garbage, or your program might crash

**Always check your indices**. Out-of-bounds access is one of the **most dangerous bugs** in C and the cause of many **real security vulnerabilities** (buffer overflows). Welcome to low-level programming

---

## Mission: The Shift Log

The computing center runs in three shifts. At the end of each shift, the operator writes down three power draw readings for the magnetic tape unit on the teletype tape.

1. Read **3 integers** from input, one at a time, into the **draw** array (size 3): **draw[0]**, **draw[1]**, **draw[2]**
2. Print the **size** of the array (use the **sizeof** trick)
3. Print the **first** element
4. Print the **last** element (index **2**)

**Example**

Input

```text
10 20 30
```

Output

```text
3
10
30
```

**Example**

Input

```text
5 15 25
```

Output

```text
3
5
25
```
