In programming we often want to **store** values to use them later. The simplest example: numbers. In C, before storing anything, we have to tell the language **what kind of value** we’re storing. This is called a **type**

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

**int** is the type for **whole numbers** (1, 2, 100, -20, 0). C cares about types — it won’t let us store a number in a variable without saying what kind of number

---

Notice the new thing: **%d** inside the **printf**. This is a **format specifier**. **printf** doesn’t know how to display an **int** by itself, we have to tell it: "here’s an int, please print it"

- **%d** → for an **int**
- **\n** → new line, as before

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

We can use multiple specifiers in one line

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

The first **%d** is replaced by **a**, the second by **b**, in order

---

We can do math, just like in any other language

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

Output **8**. Same rule: the **right side** of **=** is computed first, then stored on the left

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

Output **11**. **n++** is the same as **n = n + 1**

---

A small surprise. Try this

```c
#include <stdio.h>

int main(void) {
    int a = 7;
    int b = 2;
    printf("%d\n", a / b);
    return 0;
}
```

Output **3**, not **3.5**. Why? Because **a / b** with two ints gives back an **int** — C throws away the decimal part. We’ll see how to keep the decimals in the next lesson, with **float**

---

On the right, set the variables **age** and **x**, then display

```text
My age is 60
x is 5
```

You’ll need **two** **printf** calls and **%d** twice :)
