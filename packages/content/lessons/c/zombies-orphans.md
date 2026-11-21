When a child process ends, it doesn't disappear right away. The kernel throws away its memory and its code, but keeps one small entry about it in the process table: its PID and its exit status. It keeps them for the parent, who may still want to read them with wait

A process that has ended, but whose parent hasn't collected it yet, is called a **zombie**. Dead, but still on the list

---

On Linux, the kernel shows every process as a folder in **/proc**. The file /proc/PID/stat starts with the PID, the program's name in parentheses, and a letter for the state: R for running, S for sleeping, Z for zombie

To build that path, we need the PID inside a string. **snprintf** does it: it works like printf, but writes into an array of chars, and never more than the size we give it

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    pid_t pid = 1;
    char path[64];
    snprintf(path, sizeof(path), "/proc/%d/stat", pid);
    printf("%s\n", path);
    return 0;
}
```

Output

```text
/proc/1/stat
```

---

To see a zombie, we wait for the child to end **without** collecting it. **waitid** can do that with the flag WNOWAIT: it waits, tells us how the child ended, and leaves it in the table

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

char state_of(pid_t pid) {
    char path[64];
    snprintf(path, sizeof(path), "/proc/%d/stat", pid);
    FILE *f = fopen(path, "r");
    if (f == NULL) {
        return '-';
    }
    char state = '?';
    fscanf(f, "%*d %*s %c", &state);
    fclose(f);
    return state;
}

int main(void) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        _exit(3);
    }

    siginfo_t info;
    waitid(P_PID, pid, &info, WEXITED | WNOWAIT);
    printf("after it ended: %c\n", state_of(pid));

    int status;
    waitpid(pid, &status, 0);
    printf("after waitpid: %c\n", state_of(pid));
    return 0;
}
```

Output

```text
after it ended: Z
after waitpid: -
```

In fscanf, `%*d` and `%*s` read a value and throw it away, so we skip the PID and the name and keep only the state letter. After waitpid, the entry is gone, the folder is gone, and fopen fails

---

One zombie costs almost nothing. But a long running program that starts children and never waits for them fills the process table with zombies, and one day fork fails because there's no room left. That's why every fork needs a wait somewhere

---

The other way round: what if the **parent** ends first? Its children become **orphans**. They keep running, and the kernel gives them a new parent: process number 1, the first process of the system, or of the container. Process 1 waits for every child it gets, so orphans never stay zombies for long

```text
pid_t pid = fork();
if (pid == 0) {
    sleep(1);
    printf("my parent is now %d\n", getppid());
    fflush(stdout);
    _exit(0);
}
return 0;
```

The parent returns right away. One second later, the orphan prints that its parent is 1

---

## Mission: The Ghost Count

The night operator says the process table is full of ghosts. Show them how zombies appear and disappear

1. Read a whole number n, from 1 to 5
2. Start n children, one after another. Child number i, counting from 1, exits right away with the code i × 10
3. For each child, in order, wait for it with waitid and WNOWAIT, then print its state from /proc, as in the example
4. Then collect each child, in order, with waitpid, and print its exit code
5. Last, print the state of each child once more. Its /proc file is gone now, so print `gone`

Call fflush(stdout) before every fork

**Example**

Input

```text
2
```

Output

```text
child 1: Z
child 2: Z
child 1: exit 10
child 2: exit 20
child 1: gone
child 2: gone
```
