A **function** in C is a piece of code we write **once** and reuse **many times**

```c
#include <stdio.h>

void greet(char name[]) {
    printf("Hello, %s!\n", name);
}

int main(void) {
    greet("Ritchie");
    greet("Thompson");
    greet("Kernighan");
    return 0;
}
```

Output

```text
Hello, Ritchie!
Hello, Thompson!
Hello, Kernighan!
```

Let's break down the function header

```text
void greet(char name[])
```

- **void** — the function does **NOT** return anything (it just prints)
- **greet** — the name of the function
- **(char name[])** — the parameter list. **char name[]** means "a string" (a piece of text). We'll talk about strings in a dedicated lesson

The format specifier **%s** in **printf** is for strings, just like **%d** is for ints

---

A function can also **return** a value. Instead of **void**, we put the return type

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    int result = add(2, 3);
    printf("%d\n", result);
    return 0;
}
```

Output **5**

The function **add** takes two ints and returns an int. The **return** keyword sends the value back, and **the function exits immediately** when **return** runs

We can also use the result directly in another expression

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main(void) {
    printf("%d\n", add(2, 3) * 10);   // 50
    return 0;
}
```

---

**Important detail in C**: a function must be **declared before it is used**. That's why **add** is written **above** **main**. If we put it below, the compiler reads **main** first, sees **add** being called, doesn't know what **add** is, and complains

```c
#include <stdio.h>

int main(void) {
    int x = add(2, 3);   // ERROR: add is not yet known
    return 0;
}

int add(int a, int b) {   // declared too late
    return a + b;
}
```

There is a workaround: **forward declarations** (also called **prototypes**). We write the function header at the top, the body anywhere

```c
#include <stdio.h>

int add(int a, int b);   // prototype

int main(void) {
    printf("%d\n", add(2, 3));
    return 0;
}

int add(int a, int b) {   // body, written later
    return a + b;
}
```

Notice the **;** at the end of the prototype — it's a declaration, not a body. For now, the simplest is to write your helper functions **above** **main** and stop worrying

---

## Mission: The Terminal's Arithmetic Module

In an old-time computing center, every terminal needed its own quick arithmetic module, so operators wouldn't have to do the same calculations by hand every time.

Write a function **calculator** that takes three parameters: **int number1**, **int number2**, and **char operator** (a single character like **'+'**, **'-'**, **'\*'**, **'/'** — note the **single quotes** for a single char in C).

The function should print the result of the operation, in the format **number1 operator number2 = result**. If the operator is not recognized, print **Invalid operator**.

1. Handle **addition** (**'+'**), **subtraction** (**'-'**), **multiplication** (**'\*'**), and **division** (**'/'**)
2. Use **%c** as the format specifier for a single **char**
3. Use **==** to compare the char (this works in C because chars are, under the hood, small integers)

In **main**, call **calculator** five times, with exactly these sets of arguments, in order:

- **14, 12, '+'**
- **10, 3, '-'**
- **5, 4, '\*'**
- **10, 2, '/'**
- **1, 1, 'x'**

**Example**

Your program should print

```text
14 + 12 = 26
10 - 3 = 7
5 * 4 = 20
10 / 2 = 5
Invalid operator
```
