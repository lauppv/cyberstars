We know pipes, and we know dup2. Put them together and we can build what the shell builds when we type `seq 5 | sort -r`: two programs, the output of the first flowing straight into the input of the second

---

The plan

1. Make a pipe. Now we have fd[0] to read and fd[1] to write
2. Start the first child. It points its stdout, descriptor 1, to the pipe's write end with dup2, then runs the first program
3. Start the second child. It points its stdin, descriptor 0, to the pipe's read end, then runs the second program
4. The parent closes **both** ends of the pipe, and waits for both children

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    int fd[2];
    pipe(fd);

    fflush(stdout);
    pid_t left = fork();
    if (left == 0) {
        dup2(fd[1], 1);
        close(fd[0]);
        close(fd[1]);
        execlp("seq", "seq", "5", NULL);
        _exit(127);
    }

    pid_t right = fork();
    if (right == 0) {
        dup2(fd[0], 0);
        close(fd[0]);
        close(fd[1]);
        execlp("sort", "sort", "-r", NULL);
        _exit(127);
    }

    close(fd[0]);
    close(fd[1]);
    waitpid(left, NULL, 0);
    waitpid(right, NULL, 0);
    return 0;
}
```

Output

```text
5
4
3
2
1
```

---

Why so much closing? Because of how a reader learns that the data has ended. sort reads until read returns 0, and read returns 0 only when **no process at all** still holds the write end open

After fork, every process has its own copy of both ends. The first child's copy of fd[1] closes when seq ends. But if the parent, or the second child, keeps its own copy of fd[1] open, the pipe never looks finished. sort waits forever for more numbers, and the whole program hangs

So the rule: every process closes every pipe end it doesn't use. After dup2, the children don't even need the original numbers anymore, so they close both

---

The two programs really run at the same time. seq doesn't produce all its numbers first: as soon as it writes some, sort can read them. If the pipe fills up, about 64 KB, seq waits until sort makes room. The kernel takes care of all of that

---

Which exit status does a pipeline have? In the shell, `$?` after a pipeline is the exit status of the **last** program. That's the one we wait for and report

---

## Mission: The Pipe Fitter

The operators want to type two-stage pipelines at the console, just like in a shell

1. Read lines until the input ends. Each line has two commands separated by `|`, like `seq 5 | sort -r`. Each command is a program and its arguments, separated by spaces
2. For each line, connect the two commands with a pipe, run both, and wait for both
3. After that, print `[exit N]`, with the exit status of the second command
4. If exec fails, the child exits with 127

Call fflush(stdout) before every fork. Lines have at most 100 characters and each command at most 8 words. The first command never reads input

**Example**

Input

```text
seq 5 | sort -r
echo tape reel card | wc -w
nosuchcmd | wc -l
seq 3 | nosuchcmd
```

Output

```text
5
4
3
2
1
[exit 0]
3
[exit 0]
0
[exit 0]
[exit 127]
```

When the first program can't start, the pipe just ends empty, and wc counts 0 lines
