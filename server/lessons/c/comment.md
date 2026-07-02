**Comments** are pieces of text in our code that the compiler **ignores**. We use them to **explain** code or to **disable** lines without deleting them

In C, a single-line comment starts with **//**

```c
#include <stdio.h>

int main(void) {
    // this is a comment
    int a = 1 + 2 + 3;
    printf("%d\n", a);   // display variable a
    return 0;
}
```

Everything after **//** on a line is ignored. The program runs as if those parts weren't there

---

Comments are great for **temporarily disabling** code

```c
#include <stdio.h>

int main(void) {
    int a = 1 + 2 + 3;
    // printf("%d\n", a);
    return 0;
}
```

Now nothing is printed, because the **printf** is **commented out**. Very useful when debugging — instead of deleting code and rewriting it later, you just comment it out

---

For longer comments that span multiple lines, C also has **/\* ... \*/**

```c
#include <stdio.h>

int main(void) {
    /*
    This is a
    multi-line
    comment
    */
    printf("Hello\n");
    return 0;
}
```

In old C code (before C99), only **/\* \*/** existed. **//** was added later, copied from C++. Today both work. Most modern code uses **//**

---

## Mission: System Log

The system prints a boot log to the teletype, but one of the lines contains an internal access code that must not end up in the public log.

- Write four **printf** calls, in order, that print: `PDP-11`, `Bell Labs Computing Center`, `ACCESS-7734-SECRET`, and the number `1972`
- Comment out the third printf call (the one with the access code), so that its line no longer appears in the output

**Example**

Your program should print

```text
PDP-11
Bell Labs Computing Center
1972
```

Don't delete anything — just **comment** the line you don't want to run
