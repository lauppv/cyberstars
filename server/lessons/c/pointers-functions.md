When you pass a variable to a function, the function receives a **copy**. Pointers let us do something special: **pass by reference**

First, let's look at the problem. This function tries to swap two numbers but **fails**

```c
#include <stdio.h>

void swap(int a, int b) {
    int temp = a;
    a = b;
    b = temp;
}

int main(void) {
    int x = 10, y = 20;
    swap(x, y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

Output

```text
x = 10, y = 20
```

Nothing happened! The function swapped its **local copies**, but the original **x** and **y** never changed. The copies were destroyed when the function ended

---

The fix: **pass pointers** instead of values

```c
#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void) {
    int x = 10, y = 20;
    swap(&x, &y);
    printf("x = %d, y = %d\n", x, y);
    return 0;
}
```

Output

```text
x = 20, y = 10
```

Now it works. We passed the **addresses** of x and y. The function followed those addresses and changed the real values. This is **pass by reference** — the most important use of pointers

---

This pattern shows up everywhere in C. Want a function to modify a variable? Pass it the address

```c
#include <stdio.h>

void double_it(int *n) {
    *n = *n * 2;
}

int main(void) {
    int score = 50;
    double_it(&score);
    printf("%d\n", score);   // 100
    return 0;
}
```

Another common use: functions that need to **return multiple values**. A C function can only return a single thing, but with pointers we can "return" as many as we want

```c
#include <stdio.h>

void min_max(int arr[], int n, int *min, int *max) {
    *min = arr[0];
    *max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < *min) *min = arr[i];
        if (arr[i] > *max) *max = arr[i];
    }
}

int main(void) {
    int numbers[] = {3, 7, 1, 9, 4};
    int lo, hi;
    min_max(numbers, 5, &lo, &hi);
    printf("Min: %d, Max: %d\n", lo, hi);
    return 0;
}
```

Output

```text
Min: 1, Max: 9
```

The function "returns" both the minimum and the maximum through pointers. This is idiomatic C — you'll see it everywhere

---

## Mission: The Signal Amplifier

At the computing center, a signal translator reads a raw value off a magnetic tape. The amplifier needs to **triple** it before sending it onward — but direct access to the variable isn't allowed, only through a pointer.

1. Read an **int** **signal** from input
2. Write a function **triple_it** that takes a **pointer to int** and triples the value it points to
3. Call **triple_it(&signal)** from **main**
4. Print the result

**Example**

Input

```text
5
```

Output

```text
15
```

**Example**

Input

```text
10
```

Output

```text
30
```
