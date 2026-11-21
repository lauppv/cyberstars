Every open file has a **position**, also called the offset: the place where the next read or write will happen. It starts at 0, the first byte. Each read and each write moves it forward by the number of bytes they used. That's why reading in a loop goes through the whole file, piece by piece

**lseek** lets us move that position ourselves, anywhere in the file

```c
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    int fd = open("letters.txt", O_RDWR | O_CREAT | O_TRUNC, 0644);
    write(fd, "ABCDEFGHIJ", 10);

    char c;
    lseek(fd, 3, SEEK_SET);
    read(fd, &c, 1);
    write(1, &c, 1);

    lseek(fd, -1, SEEK_END);
    read(fd, &c, 1);
    write(1, &c, 1);
    write(1, "\n", 1);

    close(fd);
    return 0;
}
```

Output

```text
DJ
```

`lseek(fd, offset, from)` moves the position. The third argument says where we count from

- `SEEK_SET` from the start of the file
- `SEEK_CUR` from where we are now
- `SEEK_END` from the end of the file, so -1 is the last byte

It returns the new position, counted from the start

---

That return value gives us a quick way to find a file's size: jump to the end, and see where we are

```c
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

int main(void) {
    char text[] = "reel 7, side A\n";
    int fd = open("tape.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    write(fd, text, strlen(text));

    off_t size = lseek(fd, 0, SEEK_END);
    printf("%ld bytes\n", (long)size);
    close(fd);
    return 0;
}
```

Output

```text
15 bytes
```

off_t is the type for positions in a file. It's a big whole number, so we print it with %ld after a cast to long

---

Where does lseek really shine? In files made of **records** that all have the same size. If every record is 16 bytes, record number i starts at byte i × 16. We can jump straight to it, without reading everything before it. This is called **random access**, and it's how databases find a row fast

```c
#include <stdio.h>
#include <string.h>
#include <fcntl.h>
#include <unistd.h>

#define SIZE 8

int main(void) {
    int fd = open("crew.dat", O_RDWR | O_CREAT | O_TRUNC, 0644);
    char names[3][SIZE] = { "ada", "alan", "grace" };
    for (int i = 0; i < 3; i++) {
        write(fd, names[i], SIZE);
    }

    char rec[SIZE];
    lseek(fd, 2 * SIZE, SEEK_SET);
    read(fd, rec, SIZE);
    printf("record 2: %s\n", rec);

    char fix[SIZE] = "linus";
    lseek(fd, 1 * SIZE, SEEK_SET);
    write(fd, fix, SIZE);

    lseek(fd, 1 * SIZE, SEEK_SET);
    read(fd, rec, SIZE);
    printf("record 1: %s\n", rec);

    printf("size: %ld\n", (long)lseek(fd, 0, SEEK_END));
    close(fd);
    return 0;
}
```

Output

```text
record 2: grace
record 1: linus
size: 24
```

Each name sits in an 8 byte slot, with `'\0'` filling the rest, so a record we read back is a ready string. Opened with O_RDWR, the same file can be read and written, and writing over record 1 changes only those 8 bytes

---

## Mission: The Record Drum

The center keeps its crew list on a drum, as records of exactly 16 bytes: a name, with `'\0'` filling the rest of the slot. Operators ask for a record by its number, or write a new name over an old one

1. Read a whole number n, then n names. Write them, in order, as 16 byte records into the file `drum.dat`, made new and empty first
2. Then read commands until the input ends
   - `get i`: jump to record i with lseek, read it and print the name. If there is no record i, print `No record ` and i
   - `set i name`: jump to record i and write the new name over it. If there is no record i, print `No record ` and i
3. At the end, print the file's size, found with lseek, as in the example

Records are numbered from 0. Names are one word of at most 15 letters. n is from 1 to 100, i from 0 to 999

**Example**

Input

```text
3
ada
grace
ken
get 1
set 1 linus
get 1
get 5
```

Output

```text
grace
linus
No record 5
Size: 48 bytes
```
