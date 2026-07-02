How does the operating system create new processes? On Unix/Linux, there's a fascinating system call: **fork()**. It **clones** the current process, creating an exact copy

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("Before fork\n");

    pid_t pid = fork();

    if (pid == 0) {
        printf("I am the CHILD, my PID: %d\n", getpid());
    } else {
        printf("I am the PARENT, child's PID: %d\n", pid);
        wait(NULL);
    }

    printf("Done\n");
    return 0;
}
```

After **fork()**, there are **two processes** running the same code. The original is the **parent**, the copy is the **child**. How do you know which one you are? **fork()** returns:

- **0** to the child process
- the **child's PID** to the parent process

That's why we check **pid == 0** — it's the only way to figure out which one we are

---

Think of it like cell division in biology. A cell splits into two identical cells. Both have the same DNA (code), but then they can go different directions. The **if/else** after fork is how we send the parent and the child down different paths

**wait(NULL)** makes the parent **stop** until the child finishes. Without it, the parent could finish first and things get messy. It's like a parent waiting at the school gate — you don't leave without your kid

---

The "Before fork" message is printed **once** (before the split). The "Done" message is printed **twice** — once from the parent and once from the child. That's the part that makes you do a double take: after fork, both processes continue from the **same point** in the code

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("Before fork\n");     // printed 1 time

    fork();

    printf("After fork\n");      // printed 2 times!
    return 0;
}
```

If you fork again inside one of those processes, you get 4 processes. Fork is **exponential**. Be careful.

---

**fork** is the foundation of how Unix works. When you open a terminal and type a command, the shell **forks** itself, and the child process **replaces itself** with the new program (using a function called **exec**, which we won't cover in detail, but it's good to know it exists)

This fork-then-exec pattern is everywhere:

1. The shell forks → now there are 2 shells
2. The child shell calls exec("ls") → the child now runs "ls"
3. The parent shell waits for the child to finish
4. "ls" finishes, the parent shell prints the prompt again

---

## Mission: The Diagnostic Terminal

A technician at the computing center needs to launch a diagnostic process that reports its own PID, while the main terminal waits for confirmation before continuing the shift.

1. Call **fork()** to create a child process
2. The **child** prints **"Child: hello from PID X"** (where X is its real PID from **getpid()**)
3. The **parent** calls **wait(NULL)**, then prints **"Parent: child has finished"**

**Example**

Your program should print (the PID will vary on each run)

```text
Child: hello from PID 12345
Parent: child has finished
```

Use **fork()**, **getpid()**, and **wait(NULL)** from **unistd.h** and **sys/wait.h**
