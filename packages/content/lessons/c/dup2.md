In the shell, `ls > list.txt` sends the output of ls into a file instead of the screen, and `sort < names.txt` makes sort read from a file instead of the keyboard. That's called **redirection**. And it's not magic in ls or sort: they still write to file descriptor 1 and read from 0, as always. The shell just changes what 1 and 0 point to, before it runs them

The system call for that is **dup2**

---

`dup2(oldfd, newfd)` makes newfd point to the same thing as oldfd. If newfd was open, it's closed first

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("report.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    dup2(fd, 1);
    close(fd);

    printf("this goes into the file\n");
    return 0;
}
```

Nothing shows on the screen. After dup2, descriptor 1 is the file, so printf, which writes to 1, writes into report.txt. We close fd right away: 1 already points to the file, and we don't need two numbers for it

---

The real power comes with fork and exec. The child redirects, then runs a program. The program never knows: it writes to 1, and 1 is our file

```c
#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        int fd = open("numbers.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
        dup2(fd, 1);
        close(fd);
        execlp("seq", "seq", "3", NULL);
        _exit(127);
    }
    waitpid(pid, NULL, 0);

    pid = fork();
    if (pid == 0) {
        int fd = open("numbers.txt", O_RDONLY);
        dup2(fd, 0);
        close(fd);
        execlp("sort", "sort", "-r", NULL);
        _exit(127);
    }
    waitpid(pid, NULL, 0);
    return 0;
}
```

Output

```text
3
2
1
```

The first child is `seq 3 > numbers.txt`. The second is `sort -r < numbers.txt`: sort reads from 0, which is now the file, and writes to the screen as usual. The parent's own 0 and 1 never change, because each child changed only its own copies

---

Since the program's output now goes into the file, an error message printed with printf would go there too. That's exactly why stderr, descriptor 2, exists: we didn't redirect it, so errors still reach the screen

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    char *args[] = { "nosuch", NULL };

    fflush(stdout);
    pid_t pid = fork();
    if (pid == 0) {
        int fd = open("out.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
        dup2(fd, 1);
        close(fd);
        execvp(args[0], args);
        perror(args[0]);
        _exit(127);
    }

    int status;
    waitpid(pid, &status, 0);
    printf("exit %d\n", WEXITSTATUS(status));
    return 0;
}
```

Output

```text
nosuch: No such file or directory
exit 127
```

---

If the parent itself needs its old stdout back later, it can keep a copy first with **dup**, which returns a new number pointing to the same place

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("log.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);

    int saved = dup(1);
    dup2(fd, 1);
    printf("this goes into the file\n");
    fflush(stdout);
    dup2(saved, 1);
    close(saved);
    close(fd);

    printf("back on the screen\n");
    FILE *f = fopen("log.txt", "r");
    char line[64];
    fgets(line, sizeof(line), f);
    printf("the file holds: %s", line);
    fclose(f);
    return 0;
}
```

Output

```text
back on the screen
the file holds: this goes into the file
```

Note the fflush before switching back: text still waiting in printf's buffer would otherwise land on the wrong side

---

## Mission: The Output Catcher

The operators want to save what programs print, look at it later, and feed it to other programs

1. Read commands, one per line, until the input ends
   - `run file program args...`: run the program in a child, with its standard output going into file, made new and empty first. When it's done, print the file's name and its size, as in the example
   - `feed file program args...`: run the program in a child, with its standard input coming from file. Its output goes to the screen as usual
   - `show file`: print what's in the file
2. If exec fails, the child prints the error with perror, which goes to stderr, and exits with 127
3. Call fflush(stdout) before every fork

Lines have at most 100 characters and 10 words. The programs only read input in feed, and a feed file always exists

**Example**

Input

```text
run list.txt seq 3
show list.txt
feed list.txt sort -r
feed list.txt wc -l
run out.txt nosuchcmd
```

Output

```text
list.txt: 6 bytes
1
2
3
3
2
1
3
out.txt: 0 bytes
```

The file of the failed command is still made, but empty: the child opened it before exec failed
