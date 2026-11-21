Our programs print, read input, open files. But a program is not allowed to touch the screen or the disk by itself. Only the operating system's core, the **kernel**, can do that. If every program could write anywhere on the disk, one buggy program could wipe everyone's files

So when a program needs something from the hardware, it asks the kernel. That request is a **system call**. The program stops, the kernel does the work with full power, then hands the result back

---

printf and scanf are friendly library functions. Underneath, they end up making system calls too. The two most basic ones are **write** and **read**, from unistd.h

```c
#include <unistd.h>

int main(void) {
    write(1, "Hello from the kernel\n", 22);
    return 0;
}
```

Output

```text
Hello from the kernel
```

write takes three things: where to write, what to write, and how many bytes. It doesn't stop at a `'\0'` and doesn't understand %d. It just copies exactly that many bytes

---

The first number, 1, is a **file descriptor**: a small number the kernel gives a process for each thing it can read from or write to. Every process starts with three of them already open

```text
0   standard input    (stdin, the keyboard or the input box)
1   standard output   (stdout, the screen)
2   standard error    (stderr, for error messages)
```

When we open a file, it gets the next free number, usually 3. To the kernel, the screen, a file and a pipe all look the same: a number we can read or write

---

read is the other side. It reads at most the number of bytes we ask for into a buffer, and **returns how many it really read**. That can be fewer than we asked, and at the end of the input it returns **0**

```c
#include <unistd.h>

int main(void) {
    char buf[8];
    ssize_t n;
    while ((n = read(0, buf, sizeof(buf))) > 0) {
        write(1, buf, n);
    }
    return 0;
}
```

Input

```text
copy me please
```

Output

```text
copy me please
```

This program copies its input to its output, 8 bytes at a time, until read returns 0. Notice that we write n bytes, not 8: the last piece is often shorter. read doesn't add a `'\0'`, so buf is not a string, and we can't print it with %s

ssize_t is a type for sizes that can also be -1. read returns -1 when something goes wrong. We'll see how to find out what went wrong in a later lesson

---

One trap. printf doesn't call write right away: it collects text in a **buffer** and writes it in big pieces, to make fewer system calls. write goes out at once. So if we mix them, the text can come out in a different order than in our code. When we mix them, we call **fflush(stdout)** before each write, to push out what printf collected

---

## Mission: The Byte Counter

The teletype line is billed by the byte, so the station wants a program that passes text through and counts it on the way

1. Copy everything from the input to the output, exactly as it is, using only read and write. Read in pieces of at most 16 bytes
2. While you copy, count the bytes and the lines. A line ends with a `'\n'`
3. After the copy, print one more line with the two counts, as in the example. You may use printf for this last line

Don't use scanf, fgets, getchar or other stdio functions to read. The input has at most 5000 bytes

**Example**

Input

```text
load tape 7
run
```

Output

```text
load tape 7
run
Bytes: 16, lines: 2
```
