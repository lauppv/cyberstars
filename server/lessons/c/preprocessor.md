Before the compiler even sees your code, a special step runs first: the **preprocessor**. Every line starting with **#** is a preprocessor directive. We've been using **#include** since the very first lesson. Let's understand what actually happens

**#include** copies the entire contents of a file into your code

```text
#include <stdio.h>    // system header — from the standard C library
#include "myheader.h"   // your own file — searched for in the current directory first
```

The difference: **< >** for system headers, **" "** for your own files. When you write **#include <stdio.h>**, the preprocessor literally pastes thousands of lines of declarations into your file before compilation. That's how **printf** becomes available

---

**#define** creates a **macro** — a name that gets replaced with a value before compilation

```c
#include <stdio.h>

#define MAX_SPEED 9600
#define PI 3.14159

int main(void) {
    int baud = MAX_SPEED;
    printf("Speed: %d\n", baud);
    printf("PI: %f\n", PI);
    return 0;
}
```

Everywhere the preprocessor sees **MAX_SPEED**, it replaces it with **9600**. It's a plain text substitution, like find-and-replace in a text editor. The compiler never sees "MAX_SPEED" — it only sees "9600"

By convention, macros are written in **UPPERCASE** so you can tell them apart from regular variables

---

**#define** can also create macros with parameters

```c
#include <stdio.h>

#define MAX(a, b) ((a) > (b) ? (a) : (b))
#define SQUARE(x) ((x) * (x))

int main(void) {
    printf("%d\n", MAX(10, 20));   // 20
    printf("%d\n", SQUARE(5));     // 25
    return 0;
}
```

The extra parentheses matter! Without them, **SQUARE(2+3)** would expand to **2+3 \* 2+3** = **2 + 6 + 3** = **11** instead of **25**. Always wrap macro parameters in parentheses

---

**Conditional compilation**: compile different code depending on a condition

```c
#include <stdio.h>

#define DEBUG

int main(void) {
    #ifdef DEBUG
        printf("Debug mode active\n");
    #endif

    printf("Terminal online\n");
    return 0;
}
```

If **DEBUG** is defined, the debug message gets compiled in. If we remove the **#define DEBUG** line, the compiler skips that printf entirely — it doesn't even exist in the final program. This is used heavily in real projects to include/exclude debug logging without deleting the code

---

## Mission: Equipment installation sheet

You're a technician at the computing center. Before handing off the new server rack and the satellite dish on the roof, you need to fill in the compiler's configuration sheet with the macros used for the geometry calculations — the diagnostics panel depends on them to compile.

Above **main**, define:

- **PI** — `3.14159`
- **AREA_RECT(w, h)** — returns `((w) * (h))` (surface area of the equipment room)
- **AREA_CIRCLE(r)** — returns `((PI) * (r) * (r))` (surface area of the dish)
- **MAX_SIZE** — `100` (the room's temperature limit, in degrees)

In **main**, use the macros to print:

1. `AREA_RECT(5, 3)` in the format **"Room: %d"**
2. `AREA_CIRCLE(4.0)` in the format **"Dish: %.2f"**
3. `MAX_SIZE` in the format **"Limit: %d"**

**Example**

Your program should print

```text
Room: 15
Dish: 50.27
Limit: 100
```
