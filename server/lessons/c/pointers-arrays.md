Here's a secret: in C, **arrays and pointers are closely related**. When you use an array name by itself, it **decays** into a pointer to its first element

```c
#include <stdio.h>

int main(void) {
    int numbers[] = {10, 20, 30, 40, 50};
    int *p = numbers;   // no & needed — numbers IS already an address

    printf("%d\n", *p);        // 10 — first element
    printf("%d\n", *(p + 1));  // 20 — second element
    printf("%d\n", *(p + 2));  // 30 — third element
    return 0;
}
```

**numbers** is essentially a pointer to the first element. **p + 1** doesn't add 1 byte — it moves to the **next int** (4 bytes forward). This is called **pointer arithmetic**, and C handles the size automatically based on the type

---

This means **array[i]** is just syntactic sugar for **\*(array + i)**. They are literally the same thing

```c
#include <stdio.h>

int main(void) {
    int numbers[] = {10, 20, 30};
    printf("%d\n", numbers[1]);       // 20
    printf("%d\n", *(numbers + 1));   // 20 — same thing!
    return 0;
}
```

This is why array indices start at **0** in C. The first element is at offset **0** from the start: **\*(array + 0)** is **\*array** is **array[0]**

---

We can also **walk through** an array with a pointer

```c
#include <stdio.h>

int main(void) {
    int numbers[] = {10, 20, 30, 40, 50};
    int n = 5;

    int *p = numbers;
    for (int i = 0; i < n; i++) {
        printf("%d\n", *p);
        p++;   // move to next element
    }
    return 0;
}
```

**p++** advances the pointer by one element (one int forward). This is equivalent to the classic **numbers[i]** loop but shows you what's happening under the hood

---

Remember when we said that passing an array to a function makes **sizeof** stop working? Now you understand **why**. When you write

```c
void print(int array[]) { }
```

the compiler actually sees

```c
void print(int *array) { }
```

The array **decays** into a pointer. The function only receives the address of the first element — it has **no idea** how big the array is. That's why we always pass the **size** as a separate parameter

---

## Mission: The Tape Buffer Summer

A raw memory buffer has been read off a magnetic tape: first its size, then the values themselves. Write a function that walks the buffer using **pointer arithmetic** and returns the sum of all the values.

1. Read an integer **n**, then **n** integers, into an array **numbers**
2. Write a function **sum_array** that takes a **pointer to int** and a **size**, and returns the **sum** of all elements
3. Use **pointer arithmetic** inside the function: access elements with **\*(ptr + i)** instead of **ptr[i]**
4. In **main**, call **sum_array** and print the result

**Example**

Input

```text
4
5 10 15 20
```

Output

```text
50
```

**Example**

Input

```text
3
1 2 3
```

Output

```text
6
```
