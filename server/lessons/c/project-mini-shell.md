Final project! We'll build a tiny piece of a **shell** — the program that runs when you open a terminal. This combines fork, pipes, and everything we've learned

A real shell does: read a command → fork → child runs the command → parent waits. We'll build a simplified version that runs a fixed sequence of "commands" (functions), demonstrating the fork-and-wait pattern

---

Here's the core idea

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void run_command(const char *cmd) {
    pid_t pid = fork();

    if (pid == 0) {
        // Child: execute the command
        printf("[child %d] Running: %s\n", getpid(), cmd);

        if (strcmp(cmd, "hello") == 0) {
            printf("Hello, CyberStars!\n");
        } else if (strcmp(cmd, "date") == 0) {
            printf("2025-01-01\n");
        } else {
            printf("Unknown command: %s\n", cmd);
        }
        _exit(0);   // child exits
    } else {
        // Parent: wait for child
        int status;
        waitpid(pid, &status, 0);
        printf("[parent] Child finished with code %d\n",
               WEXITSTATUS(status));
    }
}

int main(void) {
    run_command("hello");
    run_command("date");
    run_command("unknown_cmd");
    return 0;
}
```

**\_exit(0)** is like **return 0** but for child processes after fork — it exits immediately without running cleanup that could mess up the parent

**WEXITSTATUS(status)** extracts the actual exit code from the status value that **waitpid** gives us

---

The parent creates a child for each command, waits for it to finish, then moves to the next. This is exactly what bash does (simplified). Each command runs in **isolation** — if the child crashes, the parent survives and moves on

---

## Mission: Station Command Terminal

The station's emergency terminal is offline. Rex needs you to rebuild a minimal shell that can dispatch commands to child processes. Each command runs in isolation — if one crashes, the shell survives.

Complete the **run_command** function on the right and call it from main with these commands: **"greet"**, **"count"**, and **"unknown"**

1. The child process checks the command string and runs the matching action:
   - **"greet"** prints **"Hello from CyberStars!"**
   - **"count"** prints **"1 2 3"** (on the same line, separated by spaces)
   - anything else prints **"Error: unknown command"**
2. The parent waits for the child, then prints **"Done"**

**Output**

```text
Hello from CyberStars!
Done
1 2 3
Done
Error: unknown command
Done
```
