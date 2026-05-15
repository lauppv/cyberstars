We're entering new territory. Until now we've written code that **does things**: prints, calculates, sorts. Now we're going to understand **how the computer runs our code**. Welcome to **operating systems**

An **operating system** (OS) is the software that manages everything: your RAM, your hard drive, your screen, your keyboard. Windows, Linux, macOS — they're all operating systems. Without one, your computer is just an expensive paperweight

---

When you run a C program, the OS creates a **process**. A process is an **instance of a running program**. It has its own:
- **Code** — the instructions (your compiled C code)
- **Memory** — the stack, the heap, global variables
- **State** — is it running? waiting? done?

Right now, hundreds of processes are running on your computer: your browser, your music player, the OS itself. Each one thinks it has the computer to itself, but the OS is juggling them all

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("My process ID is: %d\n", getpid());
    printf("My parent's process ID is: %d\n", getppid());
    return 0;
}
```

Every process has a unique **PID** (Process ID). **getpid()** returns ours. **getppid()** returns our parent's PID — the process that launched us (usually the terminal/shell)

---

The **memory layout** of a process looks like this:
```text
High addresses
┌──────────────┐
│    Stack      │  ← local variables, function calls (grows DOWN)
│      ↓        │
│              │
│      ↑        │
│    Heap       │  ← malloc, dynamic memory (grows UP)
├──────────────┤
│    Data       │  ← global/static variables
├──────────────┤
│    Code       │  ← your compiled instructions
└──────────────┘
Low addresses
```

Remember **malloc**? Now you know where that memory comes from — the **heap**. And your local variables? They live on the **stack**. When you get a "stack overflow" error, it means the stack grew too much (usually from infinite recursion)

---

Processes can be in different **states**:
- **Running** — currently executing on the CPU
- **Ready** — waiting for its turn on the CPU
- **Waiting** — blocked, waiting for something (keyboard input, file read, network)
- **Terminated** — finished execution

The OS switches between processes thousands of times per second. This is called **context switching**. That's how you can listen to music AND browse the web "at the same time" — the OS is actually rapidly alternating between them

---

Another important concept: **exit codes**. When **main** returns a number, that's the **exit code** of the process
```c
int main(void) {
    return 0;   // 0 means success
}
```

**return 0** means "everything went fine." Any non-zero value means an error. In a terminal, you can check the exit code of the last command with **echo $?**. This is why we've been writing **return 0** in main all along — now you know the real reason :)

---

Print the PID of the current process and a message about the exit code

Expected output (your PID will be different)
```text
PID: 12345
Exiting with code 0
```

Use **getpid()** from **unistd.h**
