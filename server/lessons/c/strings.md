**In C, strings** are **arrays of characters**. Less convenient than a built-in type, but you'll understand exactly how text works in memory

```c
#include <stdio.h>

int main(void) {
    char name[] = "Ken Thompson";
    printf("%s\n", name);
    return 0;
}
```

Prints **Ken Thompson**. The format specifier for a string is **%s**

What does **char name[] = "Ken Thompson"** mean? It creates an array of **char**s containing the letters of the text. **char[]** is "array of characters", and **""** is the way to write a string literal that fills the array

---

Behind the scenes, every C string ends with a special hidden character: **\0** (called the **null terminator**). It marks the end of the string. So **"Tommy"** in memory is really **T, o, m, m, y, \0** — six characters. Functions like **printf** keep reading until they hit **\0**

You don't usually write **\0** yourself when using string literals. C adds it for you. Just **be aware** it exists, because forgetting it is a classic source of bugs in C

---

How long is a string? C has no methods on strings, so we use a function from the standard library

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[] = "Ken Thompson";
    printf("%zu\n", strlen(name));   // 12
    return 0;
}
```

Two new things

- **#include <string.h>** — needed for **strlen** and friends
- **%zu** — format specifier for the type **strlen** returns (a **size_t**, kind of an unsigned int). For our purposes, you can also use **%d** with a cast: **printf("%d\n", (int) strlen(name))**

**strlen** counts up to **\0**, without including it. So **strlen("Ken")** is **3**, even though the array has **4** spots in memory

---

**Comparing strings** — and **the biggest C trap around strings**

```c
#include <stdio.h>

int main(void) {
    char a[] = "hello";
    char b[] = "hello";

    if (a == b) {   // WRONG
        printf("equal\n");
    }
    return 0;
}
```

This compares **memory addresses**, not the **contents**. **a** and **b** are two different arrays in memory, so this **never** prints **equal**, even though both contain "hello"

The correct way is **strcmp** (string compare) from **<string.h>**

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char a[] = "hello";
    char b[] = "hello";
    if (strcmp(a, b) == 0) {
        printf("equal\n");
    }
    return 0;
}
```

**strcmp** returns **0** when the strings are **equal**. (Yes, equal = 0. C is full of little quirks like that)

---

A single character at a position. Since a string is just an array, we use indexing

```c
#include <stdio.h>

int main(void) {
    char name[] = "Ken Thompson";
    printf("%c\n", name[0]);    // K
    printf("%c\n", name[4]);    // T
    return 0;
}
```

**%c** is the format specifier for a single **char**. Counting starts from **0**, as always

---

Modifying characters

```c
#include <stdio.h>

int main(void) {
    char name[] = "ken";
    name[0] = 'K';
    printf("%s\n", name);   // Ken
    return 0;
}
```

We can change individual characters because **name** is an array we own. Notice the **single quotes** for a single char (**'K'**), and **double quotes** for a string (**"Ken"**). Confusing them is one of the most common mistakes in C

---

## Mission: Decode the Call Sign

A garbled transmission just came through on the line. The switchboard operator stored it in a char array. Your job: print the full call sign, its length, the first character, and the last character, so the operator can verify the signal.

Read a line of text (it may contain spaces) with **fgets** into a **name[64]** array, then strip the trailing newline with **strcspn**

1. Print the full **name** string
2. Print its **length** (use **strlen**)
3. Print the **first** character (index **0**, use **%c**)
4. Print the **last** character (index **strlen(name) - 1**, use **%c**)

**Example**

Input

```text
dennis ritchie
```

Output

```text
dennis ritchie
14
d
e
```

**Example**

Input

```text
ken thompson
```

Output

```text
ken thompson
12
k
n
```
