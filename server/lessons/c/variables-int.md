In programming we often want to **store** values so we can use them later. The simplest example: numbers. In C, before storing something, we have to tell the language **what kind of value** we're storing. This is called a **type**

```c
#include <stdio.h>

int main(void) {
    int age = 18;
    int x = 1;

    printf("%d\n", age);
    printf("%d\n", x);

    return 0;
}
```

Output

```text
18
1
```

**int** is the type for **whole numbers** (1, 2, 100, -20, 0). C cares about types — it won't let us store a number in a variable without telling it what kind of number it is

---

Notice the new thing: **%d** inside **printf**. This is a **format specifier**. **printf** doesn't know on its own how to display an **int**, we have to tell it: "here's an int, please display it"

- **%d** → for an **int**
- **\n** → new line, same as before

The format specifier (**%d**) is replaced with the value (the variable that comes after the comma)

We can mix format specifiers with regular text

```c
#include <stdio.h>

int main(void) {
    int age = 60;
    printf("My age is %d\n", age);
    return 0;
}
```

Output

```text
My age is 60
```

We can use several specifiers on a single line

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int b = 20;
    printf("a = %d, b = %d\n", a, b);
    return 0;
}
```

Output

```text
a = 10, b = 20
```

The first **%d** is replaced with **a**, the second with **b**, in order

---

We can do arithmetic, just like any regular calculation

```c
#include <stdio.h>

int main(void) {
    int a = 2;
    int b = 6;
    int c = a + b;
    printf("%d\n", c);
    return 0;
}
```

Prints **8**. Same rule: the **right side** of **=** is computed first, then stored on the left

The classic **increment by 1** also has a shortcut in C

```c
#include <stdio.h>

int main(void) {
    int n = 10;
    n++;
    printf("%d\n", n);
    return 0;
}
```

Prints **11**. **n++** is the same thing as **n = n + 1**

---

A little surprise. Let's trace what happens

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    printf("%d\n", a / b);
    return 0;
}
```

Prints **3**, not **3.5**. Why? Because **a / b** with two ints returns an **int** — C throws away the decimal part. We'll see how to keep decimals in the next lesson, with **float**

---

## Mission: New Operator's File

At the computing center, every new operator gets a file with two numbers: their age and the system access level assigned by the administrator.

Write a program that, inside **main**

- declares an **int** named **age** (any whole number you like)
- declares an **int** named **access_level** (any whole number you like)
- prints **age** on one line, with the label `Age: `
- prints **access_level** on a separate line, with the label `Access: `

**Example**

For an **age** of 45 and an **access_level** of 3, your program would print something like

```text
Age: 45
Access: 3
```
