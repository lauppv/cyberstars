So far, every variable held **one** thing. But what if we want to store the scores of a whole class? Five separate variables would be ugly. Fifty would be impossible. We need an **array**

An **array** in C is a fixed-size collection of values of the **same type**

```c
#include <stdio.h>

int main(void) {
    int scores[5] = { 80, 95, 60, 72, 88 };

    printf("%d\n", scores[0]);   // 80
    printf("%d\n", scores[1]);   // 95
    printf("%d\n", scores[4]);   // 88

    return 0;
}
```

The shape is **type name[size]**. We declared **scores** as an array of **5 ints**, then filled it with **{ ... }**

Just like in Python and Java, **counting starts from 0**. **scores[0]** is the first element, **scores[4]** is the last (because the size is 5, indices are 0-4)

---

We can let C **figure out the size** from the initializer

```c
#include <stdio.h>

int main(void) {
    int scores[] = { 80, 95, 60, 72, 88 };
    return 0;
}
```

The brackets are still empty, but the array still has size **5**. C counts the values for us. This is shorter and harder to typo

We can also create an array **without** initializing it, then fill it later

```c
#include <stdio.h>

int main(void) {
    int scores[5];
    scores[0] = 80;
    scores[1] = 95;
    scores[2] = 60;
    scores[3] = 72;
    scores[4] = 88;
    return 0;
}
```

**Warning**: until we assign values, the array contains **garbage** (whatever was in that memory before). Reading from an uninitialized array is **undefined behavior** in C — your program might print **0**, or random numbers, or crash. Always initialize before reading

---

How many elements does an array have? Here C is unfriendly compared to Python and Java

- Python: **len(arr)**
- Java: **arr.length**
- **C: there is no built-in way**

The array doesn’t **know** its own size — it’s just a chunk of memory

The classic workaround uses **sizeof**

```c
#include <stdio.h>

int main(void) {
    int scores[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(scores) / sizeof(scores[0]);
    printf("%d\n", n);   // 5
    return 0;
}
```

**sizeof(scores)** gives the total bytes of the array, **sizeof(scores[0])** gives the bytes of one element. Dividing them gives the count

**Big trap**: this trick only works on the **original** array. The moment you **pass an array to a function**, C secretly converts it to a pointer, and **sizeof** gives a different (wrong) result. So in practice, when writing functions that take arrays, we **pass the size as a separate parameter**. We’ll see this in the next lesson

---

We can change values just like in any other language

```c
#include <stdio.h>

int main(void) {
    int scores[5] = { 80, 95, 60, 72, 88 };
    scores[1] = 100;
    printf("%d\n", scores[1]);   // 100
    return 0;
}
```

---

What if we ask for an index that doesn’t exist?

```c
#include <stdio.h>

int main(void) {
    int scores[5] = { 80, 95, 60, 72, 88 };
    printf("%d\n", scores[10]);
    return 0;
}
```

Run it. **C does NOT check** whether the index is valid. Unlike Python (which raises **IndexError**) or Java (which throws **ArrayIndexOutOfBoundsException**), C just reads whatever happens to be at that memory location. You might see **0**, or random garbage, or your program might crash

**Always check your indices**. Going out of bounds is one of the **most dangerous bugs** in C and the cause of many **real-world security vulnerabilities** (buffer overflows). Welcome to low-level programming :)

---

You have an array **heroes** on the right, declared with **3** slots, all empty for now. We can’t store strings inside an int array, so we’ll keep it simple — declare it as **int**

Do the following

1. Set **heroes[0]** to **10**
2. Set **heroes[1]** to **20**
3. Set **heroes[2]** to **30**
4. Display the **size** of the array (use **sizeof** trick)
5. Display the **first** element
6. Display the **last** element (index **2**)

Expected output

```text
3
10
30
```
