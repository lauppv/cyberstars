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
Everything after **//** on a given line is ignored. The program runs as if those parts weren’t there

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
Now nothing is printed, because the **printf** is **commented out**. Very useful when debugging — instead of deleting code and rewriting later, just comment it out

---

For longer comments that span multiple lines, C also has **/\* ... \*/**
```c
/*
This is a
multi-line
comment
*/
```

In old C code (before C99), only **/\* \*/** existed. **//** was added later, copied from C++. Today both work. Most modern code uses **//**

---

The code on the right is correct, but you don’t want to print **everything**. Comment out the line with the **secret cargo**, so the program only displays
```text
Voyager
Deep Space Exploration
9001
```

Don’t delete anything — just **comment** the line you don’t want to run :)
