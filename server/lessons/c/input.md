So far, all the values in our programs were hardcoded. Time to let the **user** type something. In C, we read input with **scanf**

```c
#include <stdio.h>

int main(void) {
    int age;

    printf("Your age: ");
    scanf("%d", &age);

    printf("Next year you will be %d\n", age + 1);
    return 0;
}
```

**Run** it, type a number, press **Enter**

Two things to notice

- **scanf** is the partner of **printf**: instead of writing output, it reads input
- The first argument is a **format specifier**, exactly like in **printf**. **%d** for an int, **%f** for a float/double, **%s** for a string, **%c** for a single char
- The second argument is **&age** with a strange **&** in front

---

Why the **&**? In C, **&variable** means "the **address** of this variable". When we call **scanf**, we’re telling it: "here’s where in memory you should write the value the user types". Without the **&**, **scanf** would receive a copy of the variable’s value (which is meaningless before reading), and your program might crash or silently corrupt memory

Don’t worry too much about it for now. The rule is simple

- **printf** uses just the variable
- **scanf** uses **&variable** (almost always)

There is one exception: when reading a string (a **char[]**), you don’t use **&**. We’ll cover that in the strings lesson

---

To read a **double**

```c
#include <stdio.h>

int main(void) {
    double height;
    scanf("%lf", &height);
    printf("%f\n", height);
    return 0;
}
```

**Important**: for **scanf**, doubles use **%lf** (l for "long", f for "float"), not **%f**. **%f** in **scanf** would read a regular **float** instead. This is a small **C quirk** that catches many beginners. (For **printf**, both **%f** and **%lf** work the same on doubles. Inconsistent? Yes :))

---

Reading multiple values in one **scanf** call

```c
#include <stdio.h>

int main(void) {
    int a, b;
    scanf("%d %d", &a, &b);
    printf("Sum: %d\n", a + b);
    return 0;
}
```

The user types two numbers separated by space (or Enter), **scanf** reads both. Notice we still use **&** in front of each variable

---

But what if we want to read a **full line** with spaces? **scanf("%s")** stops at the first space, so if the user types **Tommy Vercetti**, scanf only reads **Tommy**. For full lines, we use **fgets**

```c
#include <stdio.h>

int main(void) {
    char name[64];

    printf("Full name: ");
    fgets(name, sizeof(name), stdin);

    printf("Hello %s", name);
    return 0;
}
```

**fgets** takes three arguments:

- **name** — where to store the text
- **sizeof(name)** — the maximum number of characters to read (prevents buffer overflow!)
- **stdin** — read from standard input (the keyboard)

Unlike **scanf**, **fgets** is **safe** — it will never write more characters than the buffer can hold. This is why **fgets** is preferred over **scanf** for reading strings in real C programs

One small catch: **fgets** keeps the **newline** character (**\n**) at the end. To remove it

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[64];

    printf("Full name: ");
    fgets(name, sizeof(name), stdin);
    name[strcspn(name, "\n")] = '\0';

    printf("Hello %s!\n", name);
    return 0;
}
```

**strcspn(name, "\n")** finds the position of the newline, and we replace it with **\0** (the string terminator). This is a common C pattern you'll see everywhere

---

## Mission: Crew Check-In

Every crew member arriving at the station must check in at the terminal. The system reads their **name** and **age**, then displays a welcome message with their age next year.

Read a name (single word, no spaces) and an age using **scanf**, then print the welcome line.

**Example**

If the user types

```text
Cortez
60
```

your program should print

```text
Hello Cortez, you are 60 years old. Next year you will be 61
```

Try different names and ages — the station welcomes everyone :)
