We have an array of scores. We want to do something with each one. We **could** do

```c
#include <stdio.h>

int main(void) {
    int scores[5] = { 80, 95, 60, 72, 88 };
    printf("%d\n", scores[0]);
    printf("%d\n", scores[1]);
    printf("%d\n", scores[2]);
    printf("%d\n", scores[3]);
    printf("%d\n", scores[4]);
    return 0;
}
```

Repetitive. **Forbidden**, as we said in earlier lessons :)

The classic C **for** loop goes hand in hand with arrays

```c
#include <stdio.h>

int main(void) {
    int scores[5] = { 80, 95, 60, 72, 88 };

    for (int i = 0; i < 5; i++) {
        printf("%d\n", scores[i]);
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
    int scores[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(scores) / sizeof(scores[0]);

    for (int i = 0; i < n; i++) {
        printf("%d\n", scores[i]);
    }
    return 0;
}
```

Now the loop works no matter how many elements the array has. Add or remove a score, run again, it just works

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

Start with **total = 0**, walk through every element, add it. You will write this kind of loop many times in your career. Read it line by line and make sure you understand **why** it works :)

---

**A note about functions and arrays**: as we mentioned in the previous lesson, when you pass an array to a function, the **sizeof** trick **stops working** (the array becomes a pointer). The standard fix: pass the size as a separate parameter

```c
#include <stdio.h>

void printAll(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        printf("%d\n", arr[i]);
    }
}

int main(void) {
    int scores[] = { 80, 95, 60, 72, 88 };
    int n = sizeof(scores) / sizeof(scores[0]);
    printAll(scores, n);
    return 0;
}
```

This is a very common C idiom. Get used to writing it :)

---

## Mission: Sensor Array Analysis

The station's external sensors just delivered a batch of readings. Commander Rex needs a full summary: every individual reading, the total, and the average.

1. Print each score on its own line (use a **for** loop)
2. Print the **total** of all scores
3. Print the **average** (cast to **double** to avoid integer division — use **(double) total / n**)

**Input** (already set at the top of your code — change the values to test):

- `scores` — an int array with values **{80, 95, 60, 72, 88}**

**Example**

With the starter values, your program should print

```text
80
95
60
72
88
395
79.000000
```
