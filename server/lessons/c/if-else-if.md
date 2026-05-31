Sometimes we need **more than two** branches. Imagine a rocket launching from the ground. Depending on how many seconds remain, we want to do different things

If **100** seconds left → start the onboard computers

If **60** seconds left → check the connection with the control tower

If **20** seconds left → start secondary engines

If **10** seconds left → start the main engines

Otherwise → no special action

In C, we chain branches with **else if** (just like Java)

```c
#include <stdio.h>

int main(void) {
    int seconds = 100;

    if (seconds == 100) {
        printf("Starting all onboard computers\n");
    } else if (seconds == 60) {
        printf("Checking connection with the control tower\n");
    } else if (seconds == 20) {
        printf("Starting secondary engines\n");
    } else if (seconds == 10) {
        printf("Starting the main engines\n");
    } else {
        printf("%d seconds has no effect\n", seconds);
    }

    return 0;
}
```

**Run** it. Then change **seconds** to **60**, **20**, **10**, **42**. See how the output changes

The chain runs **top to bottom**. At the **first** branch that is **true**, C runs that block and then **jumps out** of the entire chain. The remaining branches are **never checked**. So for **seconds = 60**, only one line is printed, not all of them

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

The problem: each **if** is independent. The **else** at the end only belongs to the **last** **if**. So for **seconds = 60**, the third condition fails (60 != 20), and the **else** would print **"60 seconds has no effect"** — wrong, we already handled 60 above

**Rule of thumb**: when we test the **same variable** for multiple values, **chain** with **if / else if / else**

---

C also has a **switch** statement that fits this pattern nicely, but we’ll save it for a more advanced lesson. For now, **if / else if / else** is enough :)

---

We can nest **if**s inside one another

```c
#include <stdio.h>

int main(void) {
    int seconds = 5;
    int errorDetected = 0;

    if (seconds < 10) {
        if (errorDetected) {
            printf("Error detected. Canceling the mission\n");
        } else {
            printf("No error detected. Taking off...\n");
        }
    }
    return 0;
}
```

Nested **if**s are fine, but if you go 5 levels deep, the code gets unreadable. Try to keep things flat when you can

---

## Mission: Launch Sequence

You are the launch controller. The countdown timer shows `seconds` remaining. Depending on the value, different systems must activate.

The code on the right already has the full chain. Your task: **add a new else if** branch for **30 seconds** that prints `Pressurizing fuel tanks`.

**Input** (already set at the top of your code — change the values to test):

- `seconds` — seconds remaining until launch
- `errorDetected` — whether an error was detected (0 = no, 1 = yes)

**Example**

With `seconds = 30`, your program should print

```text
Pressurizing fuel tanks
```

Change `seconds` to `60`, `10`, `5` and run again — see the whole sequence in action :)
