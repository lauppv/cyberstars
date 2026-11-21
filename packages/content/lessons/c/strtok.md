A line of text often holds several pieces: a command and its arguments, or values with commas between them. Cutting a line into pieces is called splitting, and each piece is a **token**. In C, the function for it is **strtok**, from string.h

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[] = "load tape run";
    char *word = strtok(line, " ");
    while (word != NULL) {
        printf("[%s]\n", word);
        word = strtok(NULL, " ");
    }
    return 0;
}
```

Output

```text
[load]
[tape]
[run]
```

---

strtok works in two steps, and that's the strange part

- The first call gets the string: `strtok(line, " ")`. It returns a pointer to the first token
- Every next call gets **NULL** instead of the string: `strtok(NULL, " ")`. NULL means "keep going in the same string as before". It returns the next token
- When there are no tokens left, it returns NULL, and our while loop stops

The second argument is a list of separators. Every character in it counts as one

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[] = "red, green,,blue";
    char *word = strtok(line, ", ");
    while (word != NULL) {
        printf("%s\n", word);
        word = strtok(NULL, ", ");
    }
    return 0;
}
```

Output

```text
red
green
blue
```

`", "` means "a comma or a space". Separators next to each other count as one break, so the two commas don't make an empty token

---

How does strtok remember where it stopped? It keeps a pointer in a static variable inside it, just like the static variables we wrote ourselves. That's why the next calls only need NULL

It also changes our string. Each separator after a token gets a `'\0'` written over it, so every token becomes a string of its own, right inside line. After strtok, line is no longer the full line

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[] = "load tape";
    strtok(line, " ");
    printf("%s\n", line);
    return 0;
}
```

Output

```text
load
```

Two rules come from this

1. Give strtok an array we can change, like `char line[]`, never a string literal like `char *line = "load tape"`. Writing into a literal crashes the program
2. If we still need the full line, copy it first with strcpy

---

## Mission: The Word Counter

A teletype operator types messages fast and is not careful with spaces and commas. Before a message goes out, the station wants to know what words are in it

1. Read one line with fgets and cut off the newline
2. Split it into words. A space or a comma separates two words, and there may be several of them in a row
3. Print each word with its length, as in the example
4. At the end, print how many words there were and the longest one. If two words are equally long, keep the first one

The line has at most 100 characters and at least one word

**Example**

Input

```text
load,tape  run, print
```

Output

```text
load (4)
tape (4)
run (3)
print (5)
Words: 4
Longest: print
```
