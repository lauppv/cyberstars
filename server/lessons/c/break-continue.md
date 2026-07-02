**for** and **while** loops do their job from start to finish. But what if, in the middle of a loop, we want to say "ok, that's enough, stop"? Or "skip this one, go to the next"?

C gives us two keywords for this: **break** and **continue**

---

**break** **stops** the loop completely. The remaining iterations never happen

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 100; i++) {
        if (i == 5) {
            break;
        }
        printf("%d\n", i);
    }
    return 0;
}
```

Output

```text
0
1
2
3
4
```

We told the loop to go up to **99**, but as soon as **i** became **5**, **break** kicked in and the loop ended

A real example: searching for a value in an array

```c
#include <stdio.h>

int main(void) {
    int values[] = { 10, 25, 7, 42, 13 };
    int n = sizeof(values) / sizeof(values[0]);
    int target = 42;

    for (int i = 0; i < n; i++) {
        if (values[i] == target) {
            printf("Found %d at position %d\n", target, i);
            break;
        }
        printf("Checking %d...\n", values[i]);
    }
    return 0;
}
```

The loop stops as soon as we find what we're looking for. **break** saves us time

---

**continue** is different. It doesn't stop the loop — it just **skips the rest** of the current iteration and **moves on to the next one**

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 10; i++) {
        if (i == 5) {
            continue;
        }
        printf("%d\n", i);
    }
    return 0;
}
```

Output

```text
0
1
2
3
4
6
7
8
9
```

**5** is missing. When **i** was **5**, **continue** skipped over **printf** and the loop kept going

A real example: print only **even** numbers

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i <= 10; i++) {
        if (i % 2 != 0) {
            continue;
        }
        printf("%d\n", i);
    }
    return 0;
}
```

Output: **0 2 4 6 8 10**

---

Both keywords work the same way in **while**, not just **for**

```c
#include <stdio.h>

int main(void) {
    int i = 0;
    while (1) {   // remember: 1 is "true" in C
        if (i >= 5) {
            break;
        }
        printf("%d\n", i);
        i++;
    }
    return 0;
}
```

**while (1)** would normally be infinite, but **break** lets us escape

---

A small warning: **break** and **continue** can make code harder to read if you abuse them. Use them when they make the logic clearer, not just to look clever

---

## Mission: The Punch Card Room Inspection

You are doing the annual inspection of the punch card reader room, numbered from **1** to **20**. One reader is marked **sealed for repairs** — it must be **skipped** with **continue**, without printing it. Another reader triggers the **smoke alarm** — the moment you reach it, you **stop** the inspection with **break** (without printing it either).

1. Read two integers from input: **sealed** and **alarm**
2. Walk through readers **1** to **20** with a **for** loop
3. If the current number equals **sealed**, skip it with **continue**
4. If the current number equals **alarm**, stop the loop with **break**
5. Otherwise, print the reader number

**Example**

Input

```text
13 17
```

Output

```text
1
2
3
4
5
6
7
8
9
10
11
12
14
15
16
```

**Example**

Input

```text
5 10
```

Output

```text
1
2
3
4
6
7
8
9
```
