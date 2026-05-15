How does the OS create new processes? In Unix/Linux, there's a fascinating system call: **fork()**. It **clones** the current process, creating an exact copy

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
        printf("I am the PARENT, child PID: %d\n", pid);
        wait(NULL);
    }

    printf("Done\n");
    return 0;
}
```

After **fork()**, there are **two processes** running the same code. The original is the **parent**, the copy is the **child**. How do they know who's who? **fork()** returns:
- **0** to the child process
- The **child's PID** to the parent process

That's why we check **pid == 0** — it's the only way to tell which one we are

---

Think of it like cell division in biology. One cell splits into two identical cells. Both have the same DNA (code), but they can then go in different directions. The **if/else** after fork is how we send parent and child on different paths

**wait(NULL)** makes the parent **pause** until the child finishes. Without it, the parent might finish first, and things get messy. It's like a parent waiting at the school gate — don't leave without your kid

---

The "Before fork" message prints **once** (before the split). The "Done" message prints **twice** — once from the parent and once from the child. This is the mind-bending part: after fork, both processes continue from the **same point** in the code

```c
printf("Before fork\n");     // prints 1 time

fork();

printf("After fork\n");      // prints 2 times!
```

If you fork again inside one of those processes, you get 4 processes. Fork is **exponential**. Be careful :)

---

**fork** is the foundation of how Unix works. When you open a terminal and type a command, the shell **forks** itself, and the child process **replaces itself** with the new program (using a function called **exec**, which we won't cover in detail but it's good to know it exists)

This fork-then-exec pattern is everywhere:
1. Shell forks → now there are 2 shells
2. Child shell calls exec("ls") → child is now running "ls"
3. Parent shell waits for child to finish
4. "ls" finishes, parent shell shows the prompt again

---

Write a program that forks. The **child** should print **"Child: hello from PID X"** (where X is its PID). The **parent** should **wait** for the child, then print **"Parent: child finished"**

Expected output (PID will vary)
```text
Child: hello from PID 12345
Parent: child finished
```

Use **fork()**, **getpid()**, and **wait(NULL)**. Don't forget to include **unistd.h** and **sys/wait.h**
