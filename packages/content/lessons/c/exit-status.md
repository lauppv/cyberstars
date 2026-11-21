In the Fork lesson, the parent called wait(NULL): "wait until my child is done". But a parent often wants to know **how** the child ended. Did it finish its job? Did it fail? Did it crash? The child can tell it, with a small number: its **exit status**

---

The child sets that number when it ends, with **\_exit(code)** from unistd.h. By habit, 0 means "all good" and anything else means something went wrong. The parent collects it with **waitpid**

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        _exit(7);
    }

    int status;
    waitpid(pid, &status, 0);
    if (WIFEXITED(status)) {
        printf("child exited with %d\n", WEXITSTATUS(status));
    }
    return 0;
}
```

Output

```text
child exited with 7
```

Why \_exit and not exit, from stdlib.h? After fork, the child has a copy of everything the parent had: the input that scanf already read ahead, and the text that printf keeps before it shows it. exit would treat those copies as the child's own, so the parent's input could be read twice and its text printed twice. \_exit ends the child at once and leaves them alone. If the child printed something itself, it calls fflush(stdout) just before \_exit

`waitpid(pid, &status, 0)` waits for that one child, the one with this pid, and writes into status how it ended. wait(NULL) waits for any child and throws that information away

status packs several things into one int, so we don't read it directly. We ask it with macros from sys/wait.h

- `WIFEXITED(status)`: true if the child ended normally, with \_exit, exit or return
- `WEXITSTATUS(status)`: then, the number it gave to \_exit

---

The exit status is only one byte: from 0 to 255. \_exit(300) arrives as 300 % 256, which is 44. It's made for short answers, like "0 for ok, 1 for this problem, 2 for that one", not for big results

---

A child can also end without calling \_exit: it can crash. Then a **signal** ended it, a message from the kernel. We'll learn more about signals soon. For now, two macros tell us which one it was

- `WIFSIGNALED(status)`: true if a signal killed the child
- `WTERMSIG(status)`: the number of that signal

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    pid_t pid = fork();
    if (pid == 0) {
        abort();
    }

    int status;
    waitpid(pid, &status, 0);
    if (WIFSIGNALED(status)) {
        printf("child killed by signal %d\n", WTERMSIG(status));
    }
    return 0;
}
```

Output

```text
child killed by signal 6
```

abort() stops a program on purpose, with signal 6, SIGABRT. A bad pointer gives signal 11, SIGSEGV, the "Segmentation fault". The parent survives in both cases: a crash in a child never takes the parent down

---

Now a trap that catches everyone who uses printf with fork. Remember that printf collects text in a buffer before it writes it. fork copies the whole process, **the buffer too**. So text that the parent printed but that was still waiting in the buffer gets printed twice: once by the parent, once by the child

In a terminal you may not notice, because there printf writes each line right away. But when the output goes into a pipe or a file, like when the tests check your program, the buffer holds it. The fix is one line: call **fflush(stdout)** right before every fork, so the buffer is empty when it gets copied

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    printf("starting job\n");
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        _exit(0);
    }

    waitpid(pid, NULL, 0);
    printf("job done\n");
    return 0;
}
```

Output

```text
starting job
job done
```

---

## Mission: The Job Checker

The scheduler hands out small jobs, one per child process. Each child checks one number and reports back only through its exit status. The parent collects the answers and writes the report

1. Read whole numbers until the input ends
2. For each number x, fork a child. The child counts how many divisors x has, and exits with that count. But if x is negative, the job is broken: the child calls abort()
3. The parent waits for that child with waitpid, then prints one line, before it starts the next child
   - for a normal exit: `x: exit N`, where N is the exit status
   - for a child killed by a signal: `x: killed by signal S`
4. Call fflush(stdout) before every fork, so no line comes out twice

Numbers are from -100 to 200, and never 0. There are at most 20 of them

**Example**

Input

```text
12 7 -3 1
```

Output

```text
12: exit 6
7: exit 2
-3: killed by signal 6
1: exit 1
```
