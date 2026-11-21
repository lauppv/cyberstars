Besides its bytes, every file has information about itself, kept by the kernel: how big it is, what kind of thing it is, who may use it, when it was last changed. The system call **stat** reads all of it into a struct

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    int fd = open("tape.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "reel 7\n", 7);
    close(fd);

    struct stat st;
    if (stat("tape.txt", &st) == -1) {
        return 1;
    }
    printf("size: %ld bytes\n", (long)st.st_size);
    return 0;
}
```

Output

```text
size: 7 bytes
```

We give stat a name and the address of a `struct stat`, and it fills the fields. It returns -1 and sets errno when it fails, like open

---

The fields we use most

- `st_size`: the size in bytes
- `st_mode`: the kind of file and its permissions, packed into one number
- `st_mtime`: when the file was last changed, in seconds since 1970

To ask what kind of thing it is, sys/stat.h has two helpers that take st_mode: **S_ISREG** is true for a regular file, **S_ISDIR** for a directory, which is the Unix word for a folder

```c
#include <stdio.h>
#include <sys/stat.h>

int main(void) {
    struct stat st;
    stat(".", &st);
    printf("%s\n", S_ISDIR(st.st_mode) ? "directory" : "not a directory");
    return 0;
}
```

Output

```text
directory
```

`.` always means "the folder we are in"

---

The permissions are the last 9 bits of st_mode, the same bits as the 0644 we gave open. We keep only them with a bit mask, and print them in octal with **%o**

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/stat.h>

int main(void) {
    int fd = open("secret.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    close(fd);

    chmod("secret.txt", 0600);

    struct stat st;
    stat("secret.txt", &st);
    printf("%o\n", st.st_mode & 0777);
    return 0;
}
```

Output

```text
600
```

**chmod** changes the permissions of a file that already exists. That matters, because the mode we give open only counts when O_CREAT really makes a new file. If the file was already there, it keeps its old permissions

---

## Mission: The File Inspector

The archive clerk prepares test files and then checks them. Your program does both, from commands typed one per line, until the input ends

1. `make name bytes mode`: make the file, new and empty, write that many `x` characters into it, then set its permissions to mode with chmod. The mode is written in octal, like 640: read it with scanf's **%o**
2. `info name`: look at the name with stat, and print one line
   - for a regular file: `name: file, N bytes, mode M`, with M in octal
   - for a directory: `name: directory`
   - if stat fails: `name: ` and the reason from strerror

Names have at most 30 characters. bytes is from 0 to 5000, and mode is one of 600, 640, 644, 700, 750 and 755

**Example**

Input

```text
make report.txt 120 640
info report.txt
info .
info ghost.txt
make report.txt 5 600
info report.txt
```

Output

```text
report.txt: file, 120 bytes, mode 640
.: directory
ghost.txt: No such file or directory
report.txt: file, 5 bytes, mode 600
```
