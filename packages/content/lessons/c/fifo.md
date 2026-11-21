A pipe made with pipe() has no name. Only the process that made it, and its children, hold its descriptors, so only family can use it. What if two programs that are not related want to talk?

They can use a **named pipe**, also called a **FIFO**: "first in, first out". It's a pipe that lives in a folder, with a name, like a file. Any process that knows the name can open it

---

**mkfifo**, from sys/stat.h, makes one. After that, we use it with the usual calls: open, read, write, close. Even fopen works, because to every program it looks like a file

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/stat.h>
#include <sys/wait.h>

int main(void) {
    mkfifo("tube", 0644);

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        FILE *in = fopen("tube", "r");
        char word[32];
        fscanf(in, "%31s", word);
        printf("child got: %s\n", word);
        fclose(in);
        fflush(stdout);
        _exit(0);
    }

    FILE *out = fopen("tube", "w");
    fprintf(out, "hello\n");
    fclose(out);
    waitpid(pid, NULL, 0);

    unlink("tube");
    return 0;
}
```

Output

```text
child got: hello
```

We used fork here only to have two processes in one program. The other side could just as well be a completely different program, started at another time, that opens "tube"

---

A FIFO behaves differently from a file in three ways

1. **Opening waits.** Opening for reading waits until some process opens it for writing, and the other way around. Each side waits for its partner to show up
2. **Data passes through, it's not stored.** What the reader reads is gone from the FIFO. Nothing is kept on the disk: the name is on the disk, the data is only in the kernel's memory
3. **The end comes when the writers close.** The reader gets EOF, fgets returns NULL, when every writer has closed its side

---

The name stays in the folder until we remove it, even after both programs end. So we clean up with unlink when we're done. If we don't, the next mkfifo fails with EEXIST. That's harmless, the old FIFO works just as well, but it's tidy to remove what we made

---

## Mission: The Mailbox

The day shift leaves messages for the night shift in a mailbox: a FIFO called `mailbox`. One process posts the messages, another one reads them and writes the log

1. Make the FIFO `mailbox` with mkfifo. If it's already there, that's fine
2. Fork a child, the reader. It opens the mailbox for reading, reads messages until EOF and prints each one with its number. At the end it prints how many messages there were, as in the example
3. The parent, the poster, opens the mailbox for writing, reads lines from its input until the input ends and writes each one into the mailbox. Then it closes it
4. The parent waits for the reader, removes the mailbox with unlink and prints `Mailbox removed`

Only the child prints messages, so the output always comes in the same order. Call fflush(stdout) before the fork. There are from 1 to 100 messages, each at most 100 characters, and none of them is empty

**Example**

Input

```text
load tape 7
run payroll
```

Output

```text
1: load tape 7
2: run payroll
Messages: 2
Mailbox removed
```
