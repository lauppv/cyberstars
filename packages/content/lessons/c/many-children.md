So far, our parent made one child, waited for it, then made the next one. The children took turns. But the point of having many processes is that they can work **at the same time**. On a machine with several processor cores, they really do run side by side

To do that, the parent first starts all the children, and only then waits for them

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    for (int i = 1; i <= 3; i++) {
        fflush(stdout);
        if (fork() == 0) {
            _exit(i);
        }
    }

    int sum = 0;
    int status;
    while (wait(&status) > 0) {
        sum = sum + WEXITSTATUS(status);
    }
    printf("sum of codes: %d\n", sum);
    return 0;
}
```

Output

```text
sum of codes: 6
```

Look at the child: it calls \_exit inside the loop. Without that, the child would go back to the loop and start children of its own, and we would get far more processes than we wanted

---

`wait(&status)` waits for **any** child, whichever ends first, and returns its PID. When there are no children left, it returns -1. So `while (wait(&status) > 0)` collects all of them, however many there are

The order is not fixed. The child started last may end first. If the work is different for each child, or the machine is busy, the order changes from one run to the next

---

So how do we know which answer belongs to which child? We keep the PIDs that fork returned, in an array, in the order we started them. When wait gives us a PID, we look it up in that array

```c
#include <stdio.h>
#include <unistd.h>
#include <sys/wait.h>

int do_job(int i) {
    return (i + 1) * 10;
}

int main(void) {
    int n = 3;
    pid_t pids[10];
    int results[10];

    for (int i = 0; i < n; i++) {
        fflush(stdout);
        pids[i] = fork();
        if (pids[i] == 0) {
            _exit(do_job(i));
        }
    }

    for (int k = 0; k < n; k++) {
        int status;
        pid_t done = wait(&status);
        for (int i = 0; i < n; i++) {
            if (pids[i] == done) {
                results[i] = WEXITSTATUS(status);
            }
        }
    }

    for (int i = 0; i < n; i++) {
        printf("child %d: %d\n", i, results[i]);
    }
    return 0;
}
```

Output

```text
child 0: 10
child 1: 20
child 2: 30
```

After this, results[i] holds the answer of child i, whatever the order they finished in. Then we can print everything in a fixed order

---

Why not let each child print its own answer? Because the children print at the same time, and their lines come out mixed, in a different order every run. For a report that must look the same each time, the children only compute, and the parent alone prints

---

## Mission: The Parallel Checkers

The station must check a batch of numbers: is each one prime? Each check runs in its own child, and all the children run at the same time

1. Read a whole number n, then n numbers
2. Start all n children first. Child i checks number i and exits with 1 if it's prime, 0 if it's not
3. Only then, collect all the children with wait, in whatever order they end. Match each PID to its number
4. Print the results in the order of the input, then how many were prime, as in the example

Remember that a prime number has exactly two divisors: 1 and itself. So 1 is not prime. n is from 1 to 8, and each number is from 1 to 1000000. Call fflush(stdout) before every fork

**Example**

Input

```text
4
7 12 1 999983
```

Output

```text
7: prime
12: not prime
1: not prime
999983: prime
Primes: 2
```
