signal() is easy, but old, and it behaves a bit differently on different systems. Real programs use **sigaction**. It does the same job, with more control, and the same way everywhere

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>

volatile sig_atomic_t rings = 0;

void on_ring(int sig) {
    (void)sig;
    rings++;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_ring;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = SA_RESTART;
    sigaction(SIGUSR1, &sa, NULL);

    raise(SIGUSR1);
    printf("rings: %d\n", rings);
    return 0;
}
```

Output

```text
rings: 1
```

We fill a `struct sigaction` and hand it over

- `sa_handler`: our function, or SIG_IGN, or SIG_DFL
- `sa_mask`: other signals to hold back while our handler runs. sigemptyset makes it an empty set
- `sa_flags`: options. **SA_RESTART** says: if the signal interrupted a slow system call, like read waiting for input, start that call again instead of making it fail

The last argument can receive the old setting, if we want to put it back later. NULL means we don't care

---

Sometimes a program has a part that must not be interrupted, like updating several values that belong together. It can **block** a signal for a while. A blocked signal isn't lost: the kernel marks it as **pending**, and delivers it the moment it's unblocked

We block and unblock with **sigprocmask**, using a set of signals

```c
#include <stdio.h>
#include <string.h>
#include <signal.h>

volatile sig_atomic_t rings = 0;

void on_ring(int sig) {
    (void)sig;
    rings++;
}

int main(void) {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = on_ring;
    sigemptyset(&sa.sa_mask);
    sigaction(SIGUSR1, &sa, NULL);

    sigset_t set;
    sigemptyset(&set);
    sigaddset(&set, SIGUSR1);

    sigprocmask(SIG_BLOCK, &set, NULL);
    raise(SIGUSR1);
    raise(SIGUSR1);
    raise(SIGUSR1);
    printf("while blocked: %d\n", rings);

    sigprocmask(SIG_UNBLOCK, &set, NULL);
    printf("after unblock: %d\n", rings);
    return 0;
}
```

Output

```text
while blocked: 0
after unblock: 1
```

---

Look closely: three rings, but only one handler call. A signal is not a queue. Pending is a yes or no, one bit per signal. While it's blocked, the second and third rings find the bit already set, and change nothing. So a signal can tell us "this happened at least once", never "this happened 3 times"

To ask if a signal is waiting, **sigpending** fills a set with the pending signals, and **sigismember** checks one of them

```c
#include <stdio.h>
#include <signal.h>

int main(void) {
    sigset_t set;
    sigemptyset(&set);
    sigaddset(&set, SIGUSR1);
    sigprocmask(SIG_BLOCK, &set, NULL);
    raise(SIGUSR1);

    sigset_t waiting;
    sigpending(&waiting);
    if (sigismember(&waiting, SIGUSR1)) {
        printf("SIGUSR1 is pending\n");
    }
    return 0;
}
```

Output

```text
SIGUSR1 is pending
```

---

## Mission: The Doorbell

The doorbell of the machine room is wired to SIGUSR1. When the technicians are busy, they block it, and they only want to know if someone rang. Show how that works

1. Install a handler for SIGUSR1 with sigaction. It only counts the rings it hears
2. Read words until the input ends
   - `ring`: send SIGUSR1 to yourself with raise
   - `block`: block SIGUSR1 with sigprocmask
   - `unblock`: unblock it
   - `check`: print the number of rings heard so far, and if a ring is pending, as in the example
3. At the end, unblock SIGUSR1 if it's still blocked, and print `Heard: ` and the final count

There are at most 100 words

**Example**

Input

```text
ring check block ring ring check unblock check
```

Output

```text
heard 1, pending no
heard 1, pending yes
heard 2, pending no
Heard: 2
```
