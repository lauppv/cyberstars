To work with a file using system calls, we first ask the kernel to **open** it. It gives us back a file descriptor, the small number from the last lesson, and from then on we read and write through that number. When we're done, we **close** it

```c
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("note.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "first line\n", 11);
    close(fd);

    char buf[64];
    fd = open("note.txt", O_RDONLY);
    ssize_t n = read(fd, buf, sizeof(buf));
    close(fd);

    write(1, buf, n);
    return 0;
}
```

Output

```text
first line
```

open comes from fcntl.h. It takes the file's name, then **flags** that say how we want to use the file, joined with `|`

- `O_RDONLY` only read, `O_WRONLY` only write, `O_RDWR` both
- `O_CREAT` make the file if it doesn't exist
- `O_TRUNC` if it exists, empty it first
- `O_APPEND` every write goes at the end of the file

---

The last number, 0644, is only needed with O_CREAT. It sets who may use the new file. The 0 at the front makes it an **octal** number, where each digit is 3 bits: read (4), write (2), run (1). The three digits are for the owner, the group and everyone else

```text
0644  ->  owner rw-  group r--  others r--
```

So 0644 means "I can read and write, the others can only read". This is the most common choice for a plain file

---

open returns -1 when it can't open the file: it doesn't exist, or we're not allowed. Always check it before using fd

```c
#include <stdio.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("no_such_file.txt", O_RDONLY);
    if (fd == -1) {
        printf("could not open it\n");
        return 1;
    }
    close(fd);
    return 0;
}
```

Output

```text
could not open it
```

---

With O_APPEND, we can add to a file without losing what is already there

```c
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("log.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, "start\n", 6);
    close(fd);

    fd = open("log.txt", O_WRONLY | O_APPEND);
    write(fd, "more\n", 5);
    close(fd);

    char buf[64];
    fd = open("log.txt", O_RDONLY);
    ssize_t n = read(fd, buf, sizeof(buf));
    close(fd);
    write(1, buf, n);
    return 0;
}
```

Output

```text
start
more
```

Without O_APPEND, the second write would start at the beginning of the file and cover "start"

---

Why learn open when we already have fopen? Because fopen is built on top of open. fopen adds a buffer and nice functions like fprintf, but underneath, every FILE has a file descriptor. Knowing open, we know what really happens, and in the next lessons we'll need descriptors for things fopen can't do

Every process can only have a limited number of descriptors open at once. That's why close matters: a program that opens files in a loop and never closes them will one day get -1 from open

---

## Mission: The Tape Copy

Before a tape goes to the archive, the station makes a copy on disk and stamps the end of it. Then it reads the copy back, to be sure it's all there

1. Read all the input. Write it into the file `copy.txt`, making the file new and empty first
2. Close it, then open it again with O_APPEND and add the line `end of tape`
3. Close it, open it for reading, and print the whole file to the output with read and write
4. Print one last line with the size of the file in bytes, as in the example

Use open, read, write and close for the file, not fopen. The input has at most 4000 bytes and ends with a new line

**Example**

Input

```text
reel 7
payroll 1969
```

Output

```text
reel 7
payroll 1969
end of tape
Size: 32 bytes
```
