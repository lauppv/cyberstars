We have an array of scores. We want to do something with each one. We **could** do
```c
int scores[5] = { 80, 95, 60, 72, 88 };
printf("%d\n", scores[0]);
printf("%d\n", scores[1]);
printf("%d\n", scores[2]);
printf("%d\n", scores[3]);
printf("%d\n", scores[4]);
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
int scores[] = { 80, 95, 60, 72, 88 };
int n = sizeof(scores) / sizeof(scores[0]);

for (int i = 0; i < n; i++) {
    printf("%d\n", scores[i]);
}
```
Now the loop works no matter how many elements the array has. Add or remove a score, run again, it just works

---

A classic pattern: **summing** numbers
```c
int prices[] = { 10, 20, 30, 40 };
int n = sizeof(prices) / sizeof(prices[0]);

int total = 0;
for (int i = 0; i < n; i++) {
    total = total + prices[i];
}
printf("%d\n", total);   // 100
```
Start with **total = 0**, walk through every element, add it. You will write this kind of loop many times in your career. Read it line by line and make sure you understand **why** it works :)

---

**A note about functions and arrays**: as we mentioned in the previous lesson, when you pass an array to a function, the **sizeof** trick **stops working** (the array becomes a pointer). The standard fix: pass the size as a separate parameter
```c
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

You have an array **scores** on the right, with the values **{80, 95, 60, 72, 88}**

Display **on separate lines**

1. Each score (one per line)
2. The **total** of all scores
3. The **average**

Expected output
```text
80
95
60
72
88
395
79.000000
```

For the average, **be careful with integer division** :) Cast one of the operands to **double**, like
```c
double average = (double) total / n;
printf("%f\n", average);
```

The **(double)** is a **cast** — we tell C to treat **total** as a double for this operation. The result is **79.0**, which **printf** formats as **79.000000** (6 default decimals). If you want fewer, use **%.1f** or **%.2f**, but for this exercise leave it at the default :)
