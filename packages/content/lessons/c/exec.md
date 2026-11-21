fork makes a copy of the program that is already running. But how does a shell start a completely different program, like ls or sort? With the **exec** family of system calls. exec throws away the code of the current process and loads another program in its place. Same process, same PID, new program

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    printf("before exec\n");
    fflush(stdout);
    execlp("echo", "echo", "hello", "from", "echo", NULL);
    printf("this line never runs\n");
    return 0;
}
```

Output

```text
before exec
hello from echo
```

After a successful exec, our program is gone. The echo program now runs in its place, prints its line and ends. That's why the last printf never happens: there is no "after" to come back to. **exec only returns when it fails**, and then it returns -1

---

The family has several members. The letters in their names tell how they take the arguments

- **l** (list): the arguments one by one, ending with NULL: `execlp("echo", "echo", "hi", NULL)`
- **v** (vector): the arguments in an array of strings that ends with NULL
- **p** (path): find the program in the folders of PATH, so we can write `"echo"` instead of `"/usr/bin/echo"`

The first argument is the program to run. Then come the arguments the program gets, and by habit the first of those is the program's name again. The NULL at the end tells exec where the list stops, so never forget it

```c
#include <stdio.h>
#include <unistd.h>

int main(void) {
    char *args[] = { "expr", "6", "*", "7", NULL };
    execvp(args[0], args);
    printf("exec failed\n");
    return 1;
}
```

Output

```text
42
```

execvp is the one we use when the arguments come from input, because we can fill an array as we read

---

On its own, exec ends our program. That's rarely what we want. So the classic pattern, the one every shell uses, is **fork, then exec in the child, then wait in the parent**

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char *args[] = { "seq", "3", NULL };

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        execvp(args[0], args);
        printf("%s: command not found\n", args[0]);
        fflush(stdout);
        _exit(127);
    }

    int status;
    waitpid(pid, &status, 0);
    printf("seq finished with %d\n", WEXITSTATUS(status));
    return 0;
}
```

Output

```text
1
2
3
seq finished with 0
```

The child becomes seq. The parent stays itself, waits, and reads seq's exit status like any other child's. If exec fails, for example because there is no such program, the child must stop right there with \_exit, as in the last lesson. Otherwise it would go on running the parent's code, and we would have two parents. 127 is the number shells use for "command not found"

---

A program started by exec keeps the open file descriptors of the process. Its output goes where ours went, and it reads from our input. That's how a shell's commands print to the same terminal. And it's what will let us redirect them, in the next lessons

---

## Mission: The Command Runner

The operators want to run programs from a simple runner, one command per line, and see how each one ended

1. Read lines until the input ends. Each line is a command: a program's name, then its arguments, separated by spaces
2. Split the line into words with strtok and put them in an array of strings that ends with NULL
3. Fork. The child runs the command with execvp. If exec fails, the child prints the name and `: command not found`, then exits with 127
4. The parent waits for the child and prints `[exit N]`, with the child's exit status

Call fflush(stdout) before every fork. Lines have at most 100 characters and at most 10 words. The commands don't read any input

**Example**

Input

```text
echo hello tape room
false
nosuchcmd x
expr 6 * 7
```

Output

```text
hello tape room
[exit 0]
[exit 1]
nosuchcmd: command not found
[exit 127]
42
[exit 0]
```

false is a tiny program that does nothing and exits with 1. expr does arithmetic on its arguments
