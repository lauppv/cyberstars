The final project. We will build a piece of a **shell** — the program that runs when you open a terminal. This combines **fork**, **wait** and everything we have learned about processes

A real shell works like this: it reads a command, does **fork**, the child runs the command, the parent waits. We will build a simplified version that reads commands from a teletype queue and runs them one by one, demonstrating the fork-and-wait pattern

---

Here is the basic idea

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void run_command(const char *command) {
    pid_t pid = fork();

    if (pid == 0) {
        // Child: run the command
        if (strcmp(command, "hello") == 0) {
            printf("Hello from the lab!\n");
        } else if (strcmp(command, "date") == 0) {
            printf("1974\n");
        } else {
            printf("Unknown command: %s\n", command);
        }
        fflush(stdout);   // flush the buffer before we exit
        _exit(0);         // the child exits
    } else {
        // Parent: wait for the child
        wait(NULL);
        printf("Done\n");
        fflush(stdout);   // flush here too
    }
}

int main(void) {
    run_command("hello");
    run_command("date");
    run_command("unknown");
    return 0;
}
```

**\_exit(0)** is like **return 0**, but for child processes after **fork** — it exits immediately, without extra cleanup that could confuse the parent. It has a side effect though: it does not flush **printf**'s buffer, so we have to call **fflush(stdout)** ourselves, right before **\_exit**, so the text actually reaches the teletype

**wait(NULL)** blocks the parent until the child finishes. We don't care about the exact exit code, only that it's done

---

The parent creates one child per command, waits for it to finish, then moves to the next. This is exactly how a shell works, simplified. Each command runs in **isolation** — if a child crashes, the parent survives and keeps going

---

## Mission: The lab's command terminal

You are the night-shift operator at the computing center. A teletype in the lab sends you commands to run, one at a time. Each command must be handled by a separate child process, so the lab doesn't go down if one of them fails. The command queue always ends with the word **"exit"**

Write a program that

1. Reads words from input, one at a time, with **scanf("%s", ...)**, in a loop
2. If you just read **"exit"**, stop the loop immediately, without calling **run_command**
3. Otherwise, call **run_command** with the word you read. The child process checks the string and prints
   - **"time"** prints **"12:04"**
   - **"space"** prints **"128K free"**
   - any other command prints **"Unknown command: X"**, where **X** is the command received

   Don't forget **fflush(stdout)** before **\_exit(0)**, otherwise the text printed by the child is lost

4. The parent waits for the child with **wait(NULL)**, prints **"Done"**, then flushes its own buffer with **fflush(stdout)**

**Example**

Input

```text
time
space
unknown
exit
```

Output

```text
12:04
Done
128K free
Done
Unknown command: unknown
Done
```

**Example**

Input

```text
space
exit
```

Output

```text
128K free
Done
```
