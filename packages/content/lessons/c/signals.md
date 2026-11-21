A **signal** is a tiny message the kernel delivers to a process. It carries no data, only a number with a name. We've met some already: a child killed by signal 6, SIGABRT, or 11, SIGSEGV. A few others

```text
SIGINT    2   Ctrl + C in a terminal
SIGKILL   9   stop now, can't be caught or ignored
SIGSEGV  11   bad memory access
SIGTERM  15   please stop (the polite way)
SIGCHLD  17   one of your children ended
SIGUSR1  10   free for our own use
SIGUSR2  12   free for our own use
```

Signals come from the kernel itself, like SIGSEGV, or from another process, like when we press Ctrl + C or when one program tells another to stop

---

Each signal has a **default action**. For most of them, it's "end the process". But a program can choose something else: run a function of its own, called a **handler**, or ignore the signal. The simplest call for that is **signal**, from signal.h

```c
#include <stdio.h>
#include <signal.h>

volatile sig_atomic_t rings = 0;

void on_usr1(int sig) {
    (void)sig;
    rings++;
}

int main(void) {
    signal(SIGUSR1, on_usr1);
    raise(SIGUSR1);
    raise(SIGUSR1);
    printf("rings: %d\n", rings);

    signal(SIGUSR1, SIG_IGN);
    raise(SIGUSR1);
    printf("rings: %d\n", rings);
    return 0;
}
```

Output

```text
rings: 2
rings: 2
```

**raise** sends a signal to our own process. The handler runs before raise returns, so the count is ready on the next line. After `signal(SIGUSR1, SIG_IGN)`, the signal is simply dropped. `SIG_DFL` would bring back the default action

---

A handler can run at any moment, in the middle of any line of our program. So it must be short, and careful

- Let it only set a flag or a counter, and let main do the real work
- Use the type **volatile sig_atomic_t** for anything the handler changes. sig_atomic_t is a whole number that is always read or written in one step, and volatile tells the compiler that it can change by itself, so it must always read it again
- Don't call printf in a handler. If the signal came in the middle of a printf in main, a second printf could mess up its buffer

---

To send a signal to another process, we use **kill**, from signal.h. Despite the name, it can send any signal, not only deadly ones

```c
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        pause();
        _exit(0);
    }

    kill(pid, SIGTERM);
    int status;
    waitpid(pid, &status, 0);
    if (WIFSIGNALED(status)) {
        printf("child ended by signal %d\n", WTERMSIG(status));
    }
    return 0;
}
```

Output

```text
child ended by signal 15
```

**pause** puts a process to sleep until any signal arrives. The child would sleep forever, but SIGTERM's default action ends it. A program that wants to stop politely could catch SIGTERM, save its work, and then exit by itself

---

## Mission: The Signal Board

The operators test the signal wiring of a program by sending it signals in a given order, and the program counts what it receives

1. Install handlers for SIGUSR1 and SIGUSR2 that only count, each in its own counter
2. Read words until the input ends, and do what each one says
   - `USR1`: send SIGUSR1 to yourself with raise
   - `USR2`: send SIGUSR2 to yourself
   - `ignore`: from now on, ignore SIGUSR1
   - `catch`: from now on, catch SIGUSR1 with your handler again
3. Print the two counts, as in the example
4. Then fork a child that waits with pause. Send it SIGTERM with kill, wait for it, and print the number of the signal that ended it

Call fflush(stdout) before the fork. There are at most 100 words

**Example**

Input

```text
USR1 USR2 ignore USR1 USR1 catch USR1
```

Output

```text
USR1: 2
USR2: 1
child ended by signal 15
```
