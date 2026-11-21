Sometimes a program must not wait forever: a device that never answers, a job that hangs. It needs a timer that rings after a while. **alarm**, from unistd.h, sets one: after the given number of seconds, the kernel sends us **SIGALRM**

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>

volatile sig_atomic_t rang = 0;

void on_alarm(int sig) {
    (void)sig;
    rang = 1;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_alarm;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    alarm(1);
    while (!rang) {
        pause();
    }
    printf("one second passed\n");
    return 0;
}
```

Output

```text
one second passed
```

Without a handler, SIGALRM's default action ends the program. There is only one alarm per process: a new alarm call replaces the old one, and `alarm(0)` cancels it

---

alarm counts in whole seconds. For shorter times, there is **setitimer**, from sys/time.h. It takes a struct with seconds and microseconds. A microsecond is a millionth of a second, so 250 ms is 250000 microseconds

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>
#include <unistd.h>
#include <sys/time.h>

volatile sig_atomic_t rang = 0;

void on_alarm(int sig) {
    (void)sig;
    rang = 1;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_alarm;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    struct itimerval timer;
    memset(&timer, 0, sizeof(timer));
    timer.it_value.tv_sec = 0;
    timer.it_value.tv_usec = 250000;
    setitimer(ITIMER_REAL, &timer, NULL);

    while (!rang) {
        pause();
    }
    printf("a quarter of a second passed\n");
    return 0;
}
```

Output

```text
a quarter of a second passed
```

`it_value` is when it rings. The struct also has `it_interval`, to make it ring again and again, but we leave it at 0 for a single ring. To cancel the timer, we call setitimer again with everything 0

---

The interesting part is what a signal does to a call that is **waiting**, like waitpid waiting for a child, or read waiting for input. If our handler was installed **without** SA_RESTART, the waiting call gives up: it returns -1 and sets errno to **EINTR**, "interrupted". That's exactly what we want for a timeout

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <signal.h>
#include <unistd.h>
#include <sys/wait.h>

void on_alarm(int sig) {
    (void)sig;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_alarm;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGALRM, &sa, NULL);

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        sleep(5);
        _exit(0);
    }

    alarm(1);
    int status;
    pid_t done = waitpid(pid, &status, 0);
    if (done == -1 && errno == EINTR) {
        // the timer rang before the child ended
        printf("too slow, stopping it\n");
        kill(pid, SIGKILL);
        waitpid(pid, &status, 0);
    }
    return 0;
}
```

Output

```text
too slow, stopping it
```

---

There is a small trap. The timer might ring just after the child ended, before we cancel it. So we decide by what waitpid returned, not by the flag. And after a timeout, we still kill the child and wait for it, so it doesn't become a zombie

---

## Mission: The Watchdog

Some jobs hang. The watchdog runs each command with a time limit of 500 milliseconds, and stops any command that takes longer

1. Install a handler for SIGALRM with sigaction, **without** SA_RESTART. It only sets a flag
2. Read commands, one per line, until the input ends. Each one is a program and its arguments
3. For each command, fork, and run it in the child with execvp. If exec fails, the child exits with 127
4. In the parent, start a 500 ms timer with setitimer, and wait for the child with waitpid
   - if waitpid returns the child, cancel the timer and print the command and `exit` with its exit status
   - if waitpid is interrupted, send the child SIGKILL, wait for it, and print the command and `timeout`

Call fflush(stdout) before every fork. Commands have at most 100 characters and 8 words. They never read input

**Example**

Input

```text
seq 2
sleep 5
false
```

Output

```text
1
2
seq 2: exit 0
sleep 5: timeout
false: exit 1
```

sleep 5 waits 5 seconds and then exits. The watchdog never lets it get that far
