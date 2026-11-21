When a system call fails, it usually returns -1. That tells us **that** it failed, but not **why**. Was the file missing? Were we not allowed? For the why, there is **errno**, from errno.h

errno is a global int. When a system call fails, the kernel's reason ends up in errno, as a number with a name

```text
ENOENT    No such file or directory
EEXIST    File exists
EACCES    Permission denied
ENOTDIR   Not a directory
EISDIR    Is a directory
```

---

```c
#include <stdio.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("ghost.txt", O_RDONLY);
    if (fd == -1) {
        if (errno == ENOENT) {
            printf("the file is not there\n");
        } else {
            printf("some other problem\n");
        }
        return 1;
    }
    close(fd);
    return 0;
}
```

Output

```text
the file is not there
```

Two rules about errno

1. Read it only when a call has just failed. A call that works doesn't set errno back to 0, so an old value can still be sitting there
2. Read it **right away**. The next call, even a printf, may change it

---

We don't need to remember what every number means. **strerror**, from string.h, turns errno into a sentence

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>

int main(void) {
    int fd = open("ghost.txt", O_RDONLY);
    if (fd == -1) {
        printf("open ghost.txt: %s\n", strerror(errno));
    }
    return 0;
}
```

Output

```text
open ghost.txt: No such file or directory
```

---

**perror** does the same in one call, and prints to the error output, file descriptor 2, which is the right place for error messages. It writes our text, a colon, and the sentence

```c
#include <stdio.h>
#include <fcntl.h>

int main(void) {
    int fd = open("ghost.txt", O_RDONLY);
    if (fd == -1) {
        perror("open ghost.txt");
        return 1;
    }
    return 0;
}
```

On the screen

```text
open ghost.txt: No such file or directory
```

The text looks the same, but it goes to stderr, not stdout. In a terminal we see both. But when the output goes into a file or a pipe, only stdout goes there, and the errors still reach the person at the screen. That's why real programs send their errors to stderr

---

One more useful call for files: **unlink** removes a file's name from its folder, which deletes the file. It's in unistd.h, and like the others it returns -1 and sets errno when it fails

```c
#include <stdio.h>
#include <string.h>
#include <errno.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("tmp.txt", O_WRONLY | O_CREAT | O_EXCL, 0644);
    close(fd);

    if (open("tmp.txt", O_WRONLY | O_CREAT | O_EXCL, 0644) == -1) {
        printf("second create: %s\n", strerror(errno));
    }

    unlink("tmp.txt");
    if (unlink("tmp.txt") == -1) {
        printf("second unlink: %s\n", strerror(errno));
    }
    return 0;
}
```

Output

```text
second create: File exists
second unlink: No such file or directory
```

**O_EXCL** with O_CREAT means "make it only if it doesn't exist yet". If the file is already there, open fails with EEXIST, instead of opening the old file

---

## Mission: The Error Desk

The operators type file commands at a terminal, and they make mistakes. Instead of a cryptic -1, the terminal should say exactly what went wrong

1. Read commands, one per line, until the input ends. Each one is a word and a file name
   - `create name`: make a new file with O_CREAT and O_EXCL, then close it
   - `open name`: open the file for reading, then close it
   - `remove name`: delete the file with unlink
2. For each command, print the command, the name and `ok`, or the reason it failed, found with strerror, as in the example
3. At the end, print how many commands failed

Names have at most 30 characters

**Example**

Input

```text
open ghost.txt
create notes.txt
create notes.txt
open notes.txt
open notes.txt/inside
remove notes.txt
remove notes.txt
```

Output

```text
open ghost.txt: No such file or directory
create notes.txt: ok
create notes.txt: File exists
open notes.txt: ok
open notes.txt/inside: Not a directory
remove notes.txt: ok
remove notes.txt: No such file or directory
Failed: 4
```

notes.txt is a file, not a folder, so there can't be anything inside it
