Welcome to **C**. C is the **foundation** of modern programming. Almost every language you’ve heard of (Python, Java, JavaScript, Go, Rust, even your operating system) is built on top of ideas, or even directly on top of code, written in C

C is **lower-level** than Python or Java. That means it gives us more **control** over what the computer does, but it also asks us to be more **careful**. Don’t worry, we’ll take it step by step :)

---

The simplest C program looks like this
```c
#include <stdio.h>

int main(void) {
    printf("hey, I like pizza\n");
    return 0;
}
```
**Run** it. You’ll see
```text
hey, I like pizza
```

There is some boilerplate. Let’s go through it briefly — for now, **trust it**, we’ll understand more as we go

- **#include <stdio.h>** — we’re saying "I need the standard input/output tools". Without this line, **printf** doesn’t exist
- **int main(void)** — every C program starts here. This is the **entry point**
- **{ ... }** — the **block** of code that **main** runs. Just like in Java
- **return 0;** — we tell the operating system "the program ended successfully". **0** means "all good"

The line that does the actual work is
```c
printf("hey, I like pizza\n");
```
**printf** is C’s way of printing text on the screen. It comes from **print formatted**

---

Notice that strange **\n** at the end of the string. What is it?

**\n** means **new line**. Unlike Python’s **print()** and Java’s **System.out.println**, C’s **printf** does **NOT** automatically go to a new line. If you want a new line, you have to ask for it with **\n**

```c
printf("Hello");
printf("World");
```
Output
```text
HelloWorld
```
Stuck together. With **\n**
```c
printf("Hello\n");
printf("World\n");
```
Output
```text
Hello
World
```
This is a small but important detail. Forget **\n** at your own risk :)

---

A few small reminders, just like in Java
- Text goes inside **double quotes** **""**
- Every statement ends with a **semicolon** **;**

Try removing the **;** and run the code. Read the compile error :)

---

On the right you have a C program ready to go. Inside **main**, write code that displays
```text
Hello, CyberStars!
```
Don’t forget the **\n** at the end of the string :)
