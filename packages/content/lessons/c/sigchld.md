Every time a child ends, the kernel sends its parent **SIGCHLD**. By default, the parent ignores it. But a parent that has other work to do, like a shell waiting for your next command while a job runs in the background, can catch it and collect its children right when they end, instead of stopping everything to wait

---

The handler collects children with waitpid, using two new things

- `-1` as the PID: any child
- **WNOHANG**: don't wait. If no child has ended yet, return 0 right away

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t reaped = 0;

void on_child(int sig) {
    (void)sig;
    int saved = errno;
    int status;
    while (waitpid(-1, &status, WNOHANG) > 0) {
        reaped++;
    }
    errno = saved;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_child;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGCHLD, &sa, NULL);

    int n = 3;
    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(0);
        }
    }

    // sleep returns early when a signal comes, so we check again
    while (reaped < n) {
        sleep(1);
    }
    printf("reaped: %d\n", reaped);
    return 0;
}
```

Output

```text
reaped: 3
```

Why a **loop**? Remember that signals don't queue. If three children end at almost the same moment, the parent may get only one SIGCHLD. One waitpid would collect one child and leave two zombies. The loop keeps collecting until no ended child is left

And why save errno? waitpid changes it, and the handler may have interrupted main right between a failed call and main reading errno. Putting it back makes the handler invisible

---

Now main needs to wait until all children are collected. A first idea

```text
while (reaped < n) {
    pause();
}
```

But there's a gap. If the last SIGCHLD comes right after the check `reaped < n` and before pause starts, pause sleeps forever: the signal it waits for already came. It's rare, which makes it worse: the program hangs once in a thousand runs

The fix is **sigsuspend**. We keep SIGCHLD blocked while we check, and sigsuspend unblocks it and sleeps **in one single step**, so nothing can slip in between

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

volatile sig_atomic_t reaped = 0;

void on_child(int sig) {
    (void)sig;
    int saved = errno;
    int status;
    while (waitpid(-1, &status, WNOHANG) > 0) {
        reaped++;
    }
    errno = saved;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_child;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGCHLD, &sa, NULL);

    int n = 3;
    sigset_t block, old;
    sigemptyset(&block);
    sigaddset(&block, SIGCHLD);
    sigprocmask(SIG_BLOCK, &block, &old);

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(0);
        }
    }

    while (reaped < n) {
        sigsuspend(&old);
    }
    sigprocmask(SIG_SETMASK, &old, NULL);
    printf("reaped: %d\n", reaped);
    return 0;
}
```

Output

```text
reaped: 3
```

sigsuspend(&old) sleeps with the old mask, where SIGCHLD is not blocked. When a SIGCHLD arrives, the handler runs, sigsuspend returns, and SIGCHLD is blocked again for the next check. We block it **before** starting the children, so even a child that ends very fast can't be missed

---

## Mission: The Night Batch

The night batch starts many short jobs at once and adds up their exit codes, which are the jobs' results. Collect the jobs from a SIGCHLD handler, as they end

1. Install a SIGCHLD handler with sigaction. In a loop, it collects every ended child with waitpid, -1 and WNOHANG, counts it, and adds its exit status to a total
2. Block SIGCHLD, then read a whole number n and n codes. Start n children. Child i exits right away with code i
3. Wait with sigsuspend until all n children are collected
4. Print how many were collected and the total of their codes, as in the example

n is from 1 to 30, and every code is from 0 to 255. Call fflush(stdout) before every fork

**Example**

Input

```text
4
10 0 255 7
```

Output

```text
Collected: 4
Total: 272
```
