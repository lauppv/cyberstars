Sometimes we need **more than two** branches. Picture a mainframe booting up in the morning at the computing center. Depending on how many seconds remain until it's fully up, the system goes through different stages

If **100** seconds remain → check memory

If **60** seconds remain → check peripherals

If **20** seconds remain → load the operating system kernel

If **10** seconds remain → start system processes

Otherwise → do nothing special

In C we chain branches with **else if**

```c
#include <stdio.h>

int main(void) {
    int seconds = 100;

    if (seconds == 100) {
        printf("Checking memory\n");
    } else if (seconds == 60) {
        printf("Checking peripherals\n");
    } else if (seconds == 20) {
        printf("Loading operating system kernel\n");
    } else if (seconds == 10) {
        printf("Starting system processes\n");
    } else {
        printf("%d seconds have no effect\n", seconds);
    }

    return 0;
}
```

Let's trace what happens if we change **seconds** to **60**, **20**, **10**, **42**

The chain runs **top to bottom**. At the **first** branch that is **true**, C runs that block and then **exits** the whole chain. The remaining branches are **never** checked. So for **seconds = 60**, only one line is printed, not all of them

---

Why not just write a bunch of separate **if**s? Like this

```c
#include <stdio.h>

int main(void) {
    int seconds = 60;
    if (seconds == 100) { printf("100\n"); }
    if (seconds == 60) { printf("60\n"); }
    if (seconds == 20) { printf("20\n"); }
    else { printf("other\n"); }
    return 0;
}
```

The problem: each **if** is independent. The **else** at the end belongs only to the **last if**. So for **seconds = 60**, the third condition fails (60 != 20), and the **else** would print **"other"** — wrong, we already handled 60 above

**Rule of thumb**: when testing the **same variable** against multiple values, **chain** with **if / else if / else**

---

C also has a **switch** statement that fits this pattern well, but we'll leave it for a more advanced lesson. For now, **if / else if / else** is enough

---

We can nest **if**s inside each other

```c
#include <stdio.h>

int main(void) {
    int seconds = 5;
    int error_detected = 0;

    if (seconds < 10) {
        if (error_detected) {
            printf("Error detected. Aborting launch\n");
        } else {
            printf("No error detected. Starting the system...\n");
        }
    }
    return 0;
}
```

Nested **if**s are fine, but if you go 5 levels deep, the code becomes unreadable. Try to keep things flat when you can

---

## Mission: Mainframe Boot Sequence

You are the shift operator. The boot timer shows how many seconds remain until full boot, while a separate sensor tells you whether any hardware error was detected.

Write a program that, inside **main**

- declares an **int** named **seconds**
- declares an **int** named **error_detected**
- uses an **if / else if / else** chain:
  - if `seconds` is **100** → print `Checking memory`
  - otherwise if `seconds` is **60** → print `Checking peripherals`
  - otherwise if `seconds` is **30** → print `Loading operating system kernel`
  - otherwise if `seconds` is **10** → print `Starting system processes`
  - otherwise if `seconds` is **less than 10** → check `error_detected`: if it is **1**, print `Error detected. Aborting launch`, otherwise print `No error detected. Starting the system...`
  - otherwise → print `%d seconds have no effect` (with the number of seconds in place of `%d`)

**Example**

For a **seconds** of 5 and an **error_detected** of 1, your program would print something like

```text
Error detected. Aborting launch
```
