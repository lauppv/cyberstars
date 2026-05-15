Before the compiler even sees your code, a special step runs: the **preprocessor**. All those lines starting with **#** are preprocessor directives. We've been using **#include** from the very first lesson. Let's understand what's really happening

**#include** copies the entire content of a file into your code
```c
#include <stdio.h>    // system header — from C's standard library
#include "myfile.h"   // your own file — searches current directory first
```

The difference: **< >** for system headers, **" "** for your own files. When you write **#include <stdio.h>**, the preprocessor literally pastes thousands of lines of declarations into your file before compilation. That's how **printf** becomes available

---

**#define** creates a **macro** — a name that gets replaced with a value before compilation

```c
#include <stdio.h>

#define MAX_HEALTH 100
#define PI 3.14159

int main(void) {
    int hp = MAX_HEALTH;
    printf("HP: %d\n", hp);
    printf("PI: %f\n", PI);
    return 0;
}
```

Everywhere the preprocessor sees **MAX_HEALTH**, it replaces it with **100**. It's a simple text substitution, like find-and-replace in a text editor. The compiler never sees "MAX_HEALTH" — it only sees "100"

By convention, macros are written in **ALL_CAPS** so you can tell them apart from regular variables

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

The extra parentheses are important! Without them, **SQUARE(2+3)** would expand to **2+3 * 2+3** = **2 + 6 + 3** = **11** instead of **25**. Always wrap macro parameters in parentheses

---

**Conditional compilation**: compile different code based on conditions
```c
#include <stdio.h>

#define DEBUG

int main(void) {
    #ifdef DEBUG
        printf("Debug mode is ON\n");
    #endif

    printf("Program running\n");
    return 0;
}
```

If **DEBUG** is defined, the debug message is compiled. If we remove the **#define DEBUG** line, the compiler skips that printf entirely — it doesn't even exist in the final program. This is used heavily in real projects to include/exclude debug logging

---

Create three macros:
- **AREA_RECT(w, h)** — returns width * height
- **AREA_CIRCLE(r)** — returns PI * r * r (define PI as 3.14159)
- **MAX_SIZE** — define it as 100

In main, print the area of a rectangle 5 x 3, the area of a circle with radius 4, and MAX_SIZE

Expected output
```text
Rectangle: 15
Circle: 50.27
Max: 100
```

Use **printf("%.2f")** for the circle area
