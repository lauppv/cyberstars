A **function** in C is a piece of code we write **once** and reuse **many times**. The idea is exactly the same as in Python and Java, but the syntax is C-style

```c
#include <stdio.h>

void greet(char name[]) {
    printf("Hello, %s!\n", name);
}

int main(void) {
    greet("Cortez");
    greet("Tommy Vercetti");
    greet("Lance Vance");
    return 0;
}
```

Output

```text
Hello, Cortez!
Hello, Tommy Vercetti!
Hello, Lance Vance!
```

Let’s break the function header

```c
void greet(char name[])
```

- **void** — the function does **NOT** return anything (it just prints)
- **greet** — the name of the function
- **(char name[])** — the parameter list. **char name[]** means "a string" (a piece of text). We’ll talk about strings in a dedicated lesson

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

**Important detail in C**: a function must be **declared before it is used**. That’s why **add** is written **above** **main**. If we put it below, the compiler reads **main** first, sees **add** being called, doesn’t know what **add** is, and complains

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

Notice the **;** at the end of the prototype — it’s a declaration, not a body. For now, the simplest is to write your helper functions **above** **main** and stop worrying :)

---

Write a function **calculator** that takes **three parameters**: an **int number1**, an **int number2**, and a **char operator** (a single character like **'+'**, **'-'**, etc — note the **single quotes** for a single char in C)

The function should print the result of **number1 operator number2**

Example

```c
#include <stdio.h>

void calculator(int number1, int number2, char operator) {
    if (operator == '+') {
        int result = number1 + number2;
        printf("%d %c %d = %d\n", number1, operator, number2, result);
    } else {
        printf("Invalid operator\n");
    }
}

int main(void) {
    calculator(14, 12, '+');
    return 0;
}
```

Notice the format specifier **%c** for a single **char**

Then call it from **main** with

```c
calculator(14, 12, '+');
```

Complete the function so it also handles **subtraction**, **multiplication**, and **division**

For subtraction we use **'-'**, for multiplication **'\*'**, for division **'/'**

In C we **can** use **==** to compare a **char** (since chars are essentially small integers under the hood) — unlike strings, where **==** is wrong. Don’t worry, this will become clearer in the strings lesson :)
