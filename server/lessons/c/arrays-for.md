We have an array of readings. We want to do something with each one. We **could** do

```c
#include <stdio.h>

int main(void) {
    int readings[5] = { 80, 95, 60, 72, 88 };
    printf("%d\n", readings[0]);
    printf("%d\n", readings[1]);
    printf("%d\n", readings[2]);
    printf("%d\n", readings[3]);
    printf("%d\n", readings[4]);
    return 0;
}
```

Repetitive. Exactly what we said in earlier lessons to avoid

The classic C **for** loop goes hand in hand with arrays

```c
#include <stdio.h>

int main(void) {
    int readings[5] = { 80, 95, 60, 72, 88 };

    for (int i = 0; i < 5; i++) {
        printf("%d\n", readings[i]);
    }

    return 0;
}
```

We used **i < 5**, **not** **i <= 5**. Why? Indices go from **0** to **size - 1**. For **5** elements, indices are **0, 1, 2, 3, 4**. **i = 5** would be **out of bounds**, and we already know how dangerous that is in C

---

Hardcoding **5** in the loop is fragile. If we add or remove an element, we have to remember to update the loop. Use the **sizeof** trick instead

```c
#include <stdio.h>

int main(void) {
    int readings[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(readings) / sizeof(readings[0]);

    for (int i = 0; i < n; i++) {
        printf("%d\n", readings[i]);
    }
    return 0;
}
```

Now the loop works no matter how many elements the array has. Add or remove a reading, run again, it just works

---

A classic pattern: **summing** numbers

```c
#include <stdio.h>

int main(void) {
    int prices[] = { 10, 20, 30, 40 };
    int n = sizeof(prices) / sizeof(prices[0]);

    int total = 0;
    for (int i = 0; i < n; i++) {
        total = total + prices[i];
    }
    printf("%d\n", total);   // 100
    return 0;
}
```

Start with **total = 0**, walk through every element, add it. You will write this kind of loop many times in your career. Read it line by line and make sure you understand **why** it works

---

**A note about functions and arrays**: as we mentioned in the previous lesson, when you pass an array to a function, the **sizeof** trick **stops working** (the array becomes a pointer). The standard fix: pass the size as a separate parameter

```c
#include <stdio.h>

void print_all(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d\n", arr[i]);
    }
}

int main(void) {
    int readings[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(readings) / sizeof(readings[0]);
    print_all(readings, n);
    return 0;
}
```

This is a very common C idiom. Get used to writing it

---

## Mission: The Tape Line Daily Register

The magnetic tape line sends a batch of readings for the current shift. The number of readings varies from day to day, so the first thing you receive is **how many** readings are coming.

1. Read an integer **n** from input — the number of readings
2. Read **n** integers into an array (use a loop for reading, with **scanf** inside it)
3. Print each reading on its own line (use a **for** loop)
4. Print the **total** of all the readings
5. Print the **average** (cast to **double** to avoid integer division — use **(double) total / n**)

**Example**

Input

```text
5
80 95 60 72 88
```

Output

```text
80
95
60
72
88
395
79.000000
```

**Example**

Input

```text
3
10 20 30
```

Output

```text
10
20
30
60
20.000000
```
