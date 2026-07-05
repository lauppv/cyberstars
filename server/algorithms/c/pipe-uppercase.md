# Easy · Uppercase Through a Pipe

A parent reads a word from the keyboard and sends it to the child through a pipe. The child receives the word, converts it to uppercase and prints it.

A **pipe** is a one-way channel between processes: one writes to one end (`p[1]`), the other reads from the opposite end (`p[0]`). We close the unused ends to avoid trouble — if the parent doesn't close `p[0]`, the child never sees end-of-stream when it reads.

### Input

- Line 1: a word of at most 100 characters, made up only of lowercase letters.

### Output

- A single line: the word converted to uppercase.

### Examples

```
Input:
hello
Output:
HELLO
```

```
Input:
cyberstars
Output:
CYBERSTARS
```

Use **pipe()**, **fork()**, **read()**, **write()** from `unistd.h`, **wait(NULL)** from `sys/wait.h` and **toupper()** from `ctype.h`.
