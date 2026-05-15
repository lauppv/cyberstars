Here's a secret: in C, **arrays and pointers are closely related**. When you use an array name by itself, it **decays** into a pointer to its first element

```c
#include <stdio.h>

int main(void) {
    int nums[] = {10, 20, 30, 40, 50};
    int *p = nums;   // no & needed — nums IS already an address

    printf("%d\n", *p);        // 10 — first element
    printf("%d\n", *(p + 1));  // 20 — second element
    printf("%d\n", *(p + 2));  // 30 — third element
    return 0;
}
```

**nums** is essentially a pointer to the first element. **p + 1** doesn't add 1 byte — it moves to the **next int** (4 bytes forward). This is called **pointer arithmetic**, and C handles the size automatically based on the type

---

This means **arr[i]** is just syntactic sugar for **\*(arr + i)**. They are literally the same thing

```c
#include <stdio.h>

int main(void) {
    int nums[] = {10, 20, 30};
    printf("%d\n", nums[1]);       // 20
    printf("%d\n", *(nums + 1));   // 20 — same thing!
    return 0;
}
```

This is why array indices start at **0** in C. The first element is at offset **0** from the start: **\*(arr + 0)** is **\*arr** is **arr[0]**

---

We can also **walk through** an array with a pointer

```c
#include <stdio.h>

int main(void) {
    int nums[] = {10, 20, 30, 40, 50};
    int n = 5;

    int *p = nums;
    for (int i = 0; i < n; i++) {
        printf("%d\n", *p);
        p++;   // move to next element
    }
    return 0;
}
```

**p++** advances the pointer by one element (one int forward). This is equivalent to the classic **nums[i]** loop but shows you what's happening under the hood

---

Remember when we said that passing an array to a function makes **sizeof** stop working? Now you understand **why**. When you write

```c
void print(int arr[]) { }
```

the compiler actually sees

```c
void print(int *arr) { }
```

The array **decays** into a pointer. The function only receives the address of the first element — it has **no idea** how big the array is. That's why we always pass the **size** as a separate parameter. Mystery solved :)

---

Write a function **sumArray** that takes an **int pointer** and a **size**, and returns the **sum** of all elements using **pointer arithmetic** (use **\*(ptr + i)** instead of **ptr[i]**)

Then in **main**, create the array **{5, 10, 15, 20}**, call **sumArray**, and print the result

Expected output
```text
50
```
