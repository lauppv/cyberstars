We're entering new territory. Until now we've written code that **does things**: prints, calculates, sorts. Now we're going to understand **how the computer runs our code**. Welcome to **operating systems**

An **operating system** (OS) is the software that manages everything: the RAM, the hard disk, the screen, the keyboard. Windows, Linux, macOS — they're all operating systems. Without one, your computer is just an expensive paperweight

---

When you run a C program, the operating system creates a **process**. A process is a **running instance of a program**. It has its own:

- **Code** — the instructions (your compiled C code)
- **Memory** — the stack, the heap, global variables
- **State** — running? waiting? finished?

Right now, hundreds of processes are running on your computer: the browser, the music player, the operating system itself. Each one thinks it has the computer to itself, but the operating system juggles them all

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("My process ID is: %d\n", getpid());
    printf("My parent process ID is: %d\n", getppid());
    return 0;
}
```

Every process has a unique **PID** (Process ID). **getpid()** returns our own. **getppid()** returns the PID of our parent — the process that launched us (usually the terminal/shell)

---

The **memory layout** of a process looks like this:

```text
High addresses
+--------------+
|    Stack     |  <- local variables, function calls (grows DOWN)
|      v       |
|              |
|      ^       |
|    Heap      |  <- malloc, dynamic memory (grows UP)
+--------------+
|    Data      |  <- global/static variables
+--------------+
|    Code      |  <- your compiled instructions
+--------------+
Low addresses
```

Remember **malloc**? Now you know where that memory comes from — the **heap**. And your local variables? They live on the **stack**. When you get a "stack overflow" error, it means the stack has grown too much (usually from infinite recursion)

---

Processes can be in different **states**:

- **Running** — currently running on the CPU
- **Ready** — waiting for its turn on the CPU
- **Waiting** — blocked, waiting for something (keyboard input, file read, network)
- **Terminated** — has finished execution

The operating system switches between processes thousands of times per second. This is called **context switching**. That's how you can listen to music AND browse the web "at the same time" — the operating system is actually rapidly alternating between them

---

Another important concept: **exit codes**. When **main** returns a number, that is the process's **exit code**

```c
#include <stdio.h>

int main(void) {
    return 0;   // 0 means success
}
```

**return 0** means "everything went fine." Any non-zero value means an error. In a terminal, you can check the exit code of the last command with **echo $?**. That's why we've been writing **return 0** in main from the very start — now you know the real reason.

---

## Mission: The Shift Log

It's eight in the morning at the Bell Labs computing center. Before work begins, every terminal connected to the mainframe must register its process in the operator's shift log.

1. Print the current process ID using **getpid()**
2. Print a message confirming the exit code

**Example**

Your program should print (your PID will be different — that is expected)

```text
PID: 12345
Exiting with code 0
```

Use **getpid()** from **unistd.h**
