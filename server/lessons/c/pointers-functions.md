In Python and Java, when you pass a variable to a function, the function gets a **copy**. In C it's the same — but pointers let us do something special: **pass by reference**

First, let's see the problem. This function tries to swap two numbers but **fails**

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

Nothing happened! The function swapped its **local copies**, but the original **x** and **y** didn't change. The copies were destroyed when the function returned

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

Now it works. We passed the **addresses** of x and y. The function followed those addresses and changed the actual values. This is **pass by reference** — the most important use of pointers

---

This pattern is everywhere in C. Want a function to modify a variable? Pass its address

```c
#include <stdio.h>

void doubleIt(int *n) {
    *n = *n * 2;
}

int main(void) {
    int score = 50;
    doubleIt(&score);
    printf("%d\n", score);   // 100
    return 0;
}
```

Another common use: functions that need to **return multiple values**. C functions can only return one thing, but with pointers we can "return" as many as we want

```c
#include <stdio.h>

void minMax(int arr[], int n, int *min, int *max) {
    *min = arr[0];
    *max = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < *min) *min = arr[i];
        if (arr[i] > *max) *max = arr[i];
    }
}

int main(void) {
    int nums[] = {3, 7, 1, 9, 4};
    int lo, hi;
    minMax(nums, 5, &lo, &hi);
    printf("Min: %d, Max: %d\n", lo, hi);
    return 0;
}
```

Output: **Min: 1, Max: 9**

The function "returns" both the minimum and maximum through pointers. This is idiomatic C — you'll see it everywhere

---

Write a function **tripleIt** that takes an **int pointer** and **triples** the value it points to

Then in **main**, create a variable **num** with value **5**, call **tripleIt(&num)**, and print the result

Expected output

```text
15
```
