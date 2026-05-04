In Python and Java, **strings** are a built-in type with friendly methods. **In C, strings are different** — they are **arrays of characters**. Less convenient, but you’ll understand exactly how text works in memory

```c
#include <stdio.h>

int main(void) {
    char name[] = "Tommy Vercetti";
    printf("%s\n", name);
    return 0;
}
```
Output **Tommy Vercetti**. The format specifier for a string is **%s**

What does **char name[] = "Tommy Vercetti"** mean? It creates an array of **char**s containing the letters of the text. **char[]** is "array of characters", and **""** is the way to write a string literal that fills the array

---

Behind the scenes, every C string ends with a special hidden character: **\0** (called the **null terminator**). It marks the end of the string. So **"Tommy"** in memory is really **T, o, m, m, y, \0** — six characters. Functions like **printf** keep reading until they hit **\0**

You don’t usually write **\0** yourself when using string literals. C adds it for you. Just **be aware** it exists, because forgetting it is a classic source of bugs in C

---

How long is a string? We can’t use **name.length** like in Java, since C doesn’t have methods. Instead, we use a function from the standard library
```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[] = "Tommy Vercetti";
    printf("%zu\n", strlen(name));   // 14
    return 0;
}
```
Two new things
- **#include <string.h>** — needed for **strlen** and friends
- **%zu** — format specifier for the type **strlen** returns (a **size_t**, kind of an unsigned int). For our purposes, you can also use **%d** with a cast: **printf("%d\n", (int) strlen(name))**

**strlen** counts up to **\0**, not including it. So **strlen("Tommy")** is **5**, even though the array has **6** spots in memory

---

**Comparing strings** — and **THE biggest C trap with strings**
```c
char a[] = "hello";
char b[] = "hello";

if (a == b) {   // WRONG
    printf("equal\n");
}
```
This compares **memory addresses**, not the **contents**. **a** and **b** are two different arrays in memory, so this **never** prints **equal**, even though both contain "hello"

The correct way is **strcmp** (string compare) from **<string.h>**
```c
#include <string.h>
// ...
if (strcmp(a, b) == 0) {
    printf("equal\n");
}
```
**strcmp** returns **0** when the strings are **equal**. (Yes, equal = 0. C is full of these little quirks :))

---

Single character at a position. Since a string is just an array, we use indexing
```c
char name[] = "Tommy Vercetti";
printf("%c\n", name[0]);    // T
printf("%c\n", name[6]);    // V
```
**%c** is the format specifier for a single **char**. Counting starts from **0**, like always

---

Modifying characters
```c
char name[] = "tommy";
name[0] = 'T';
printf("%s\n", name);   // Tommy
```
We can change individual characters because **name** is an array we own. Notice the **single quotes** for a single char (**'T'**), and **double quotes** for a string (**"Tommy"**). Confusing them is one of the most common C mistakes

---

You have a **char** array **name** on the right, set to **"lance vance"**. Display **on separate lines**
```text
lance vance
11
l
e
```

That is: the name itself, its **length** (with **strlen**), the **first** character, and the **last** character (use **strlen(name) - 1** as the index)

Tip: the last character of **"lance vance"** is **'e'**. Use **%c** to print individual characters
