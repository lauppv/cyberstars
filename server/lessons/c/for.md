Welcome to one of the **most important** concepts in programming — the **for** loop. With it, we ask the computer to do something **many times automatically**

Imagine we want to display all numbers from **1** to **10**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 1);
    printf("%d\n", 2);
    printf("%d\n", 3);
    // ... and so on, ten times
    return 0;
}
```

Tedious. For **1** to **1000** it’s impossible. **for** saves us

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

Run it. You’ll see the numbers from **1** to **10**, one per line

---

The C **for** has **three parts** inside the parentheses, separated by **;** — exactly like Java

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

1. **int i = 1** — the **starting point**. We declare a variable **i** and set it to **1**
2. **i <= 10** — the **condition**. While this is **true**, the loop keeps running
3. **i++** — what to do **after each iteration**. Increase **i** by 1

So **i** takes the values **1, 2, 3, ..., 10**. When **i** becomes **11**, the condition **11 <= 10** is **false** and the loop ends

A small detail: in **older C** (pre-C99), you couldn’t declare **int i** inside the **for**. You had to declare it before. In **modern C** (C99 and later, which is what we use), declaring inside is fine and idiomatic

We can count by 2s, count down, do whatever we want

```c
#include <stdio.h>

int main(void) {
    // counting by 2s
    for (int i = 0; i <= 10; i = i + 2) {
        printf("%d\n", i);
    }

    // counting down
    for (int i = 10; i >= 1; i--) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i--** means **i = i - 1**

---

Be careful — if we forget to update **i**, we get an **infinite loop**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; ) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i** stays **1** forever, the condition stays **true** forever, and the program prints **1** until something stops it. The platform stops it after 5 seconds, but in real systems an infinite loop can lock up your computer. Always make sure your condition can become false

---

Write a C program that displays all numbers from **0** to **100**. If the number is **10** or **50**, display **Pizza Margherita** instead. Otherwise display the number itself

Tip: use an **if/else** inside the loop to decide what to print
