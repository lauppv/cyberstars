Welcome to **C**.

C was born in **1972** at **Bell Labs**, where Dennis Ritchie created it to write the **UNIX** operating system. Back then there were no color monitors or mice: programmers worked at a **teletype** — a machine that looked like a typewriter and printed the computer's response directly on paper. Over 50 years later, C is still everywhere: in operating systems, routers, satellites, and the engines of other programming languages.

In this course you'll work like a programmer from the early days of UNIX: close to the machine, with full control over what happens. Let's go step by step.

---

The simplest C program looks like this

```c
#include <stdio.h>

int main(void) {
    printf("hello, world\n");
    return 0;
}
```

**Run** it. You'll see

```text
hello, world
```

By the way, `hello, world` isn't just any message: it's the **first example** from the classic C book written by the language's own creators. Every C programmer has started with exactly this program.

There's some boilerplate here. Let's walk through it briefly — for now, just **trust** it, we'll understand more along the way

- **#include <stdio.h>** — we're saying "I need the standard input/output tools". Without this line, **printf** doesn't exist
- **int main(void)** — every C program starts here. This is the **entry point**
- **{ ... }** — the **block** of code that **main** runs
- **return 0;** — we're telling the operating system "the program finished successfully". **0** means "everything's fine"

The line that does the actual work is

```text
printf("hello, world\n");
```

**printf** is how C displays text on screen. It stands for **print formatted**

---

Notice that odd **\n** at the end of the string. What is it?

**\n** means **new line**. **printf** doesn't automatically move to a new line after printing: it prints exactly what you give it, character by character, like a teletype. If you want a new line, you have to ask for it with **\n**

```c
#include <stdio.h>

int main(void) {
    printf("Hello");
    printf("World");
    return 0;
}
```

Let's trace what happens:

1. the first **printf** prints `Hello` and the cursor stays right after the `o`
2. the second **printf** prints `World` right from there

```text
HelloWorld
```

Stuck together. With **\n**

```c
#include <stdio.h>

int main(void) {
    printf("Hello\n");
    printf("World\n");
    return 0;
}
```

Output

```text
Hello
World
```

It's a small detail, but an important one.

---

Two rules to remember

- Text goes between **double quotes** **""**
- Every statement ends with a **semicolon** **;**

Try removing the **;** and run the code. Read the compile error — the C compiler always tells you exactly which line upset it.

---

## Mission: Your first day at the lab

It's your first day at the computing lab. The teletype is humming, the paper roll is loaded, and your colleagues are waiting to see if the new programmer knows the tradition.

Inside **main**, write a single **printf** that prints the message below.

**Example**

Your program should print

```text
hello, world
```

Don't forget the **\n** at the end of the string.
