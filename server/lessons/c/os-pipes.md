How do processes **talk to each other**? One of the simplest mechanisms is a **pipe**. If you've used Linux, you've already seen pipes:

```text
ls | grep ".txt"
```

The **|** symbol takes the output of **ls** and sends it as input to **grep**. That's a pipe

---

A pipe is a **one-way communication channel**. One process **writes** into it, another process **reads** from it. Think of it like a water pipe — water flows in one direction

In C, we create a pipe with the **pipe()** function

```c
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <sys/wait.h>

int main(void) {
    int fd[2];
    pipe(fd);

    // fd[0] = read end
    // fd[1] = write end

    pid_t pid = fork();

    if (pid == 0) {
        // CHILD: write to the pipe
        close(fd[0]);   // close read end (child only writes)
        char msg[] = "Hello from child!";
        write(fd[1], msg, strlen(msg) + 1);
        close(fd[1]);
    } else {
        // PARENT: read from the pipe
        close(fd[1]);   // close write end (parent only reads)
        char buf[100];
        read(fd[0], buf, sizeof(buf));
        printf("Parent received: %s\n", buf);
        close(fd[0]);
        wait(NULL);
    }

    return 0;
}
```

Output: **Parent received: Hello from child!**

---

Let's break it down:

1. **pipe(fd)** creates two file descriptors: **fd[0]** for reading, **fd[1]** for writing
2. We **fork** — now both parent and child have copies of the pipe
3. The **child** closes the read end (it only needs to write), writes a message, and closes the write end
4. The **parent** closes the write end (it only needs to read), reads the message, and closes the read end

Why do we close the ends we don't use? It's like closing a door you don't need. If the parent doesn't close the write end, the read will **never know** when the child is done writing — it will wait forever

---

**File descriptors** are a big idea. In Unix, **everything is a file**. Your keyboard is file descriptor 0 (**stdin**). Your screen is file descriptor 1 (**stdout**). Error messages go to file descriptor 2 (**stderr**). A pipe creates two new file descriptors

When you write **printf("hello")**, it goes to fd 1 (stdout → your screen). When you use **scanf**, it reads from fd 0 (stdin → your keyboard). Pipes connect the stdout of one process to the stdin of another. That's literally all the **|** symbol does in a terminal

---

Pipes are **the** fundamental building block for process communication in Unix. Shells use them, web servers use them, even Docker uses them internally. The philosophy is simple: small programs that do one thing well, connected by pipes

---

Write a program that creates a pipe and forks. The **child** writes the message **"CyberStars"** to the pipe. The **parent** reads it and prints **"Received: CyberStars"**

Expected output

```text
Received: CyberStars
```

Remember to close the ends you don't use!
