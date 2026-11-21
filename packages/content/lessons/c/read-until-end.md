So far, we always knew how much input was coming: two numbers, one line, or a count n first. Real programs often don't know. A log file can have 3 lines or 3000. The program just keeps reading until the input runs out

---

fgets gives us a clear signal for that. It returns **NULL** when there is nothing left to read. So we can put fgets right in the condition of a while loop

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char line[128];
    int count = 0;
    while (fgets(line, sizeof(line), stdin) != NULL) {
        line[strcspn(line, "\n")] = '\0';
        count++;
        printf("%d: %s\n", count, line);
    }
    printf("%d lines\n", count);
    return 0;
}
```

Input

```text
load tape
run job
print
```

Output

```text
1: load tape
2: run job
3: print
3 lines
```

Each turn of the loop reads one line. When the input ends, fgets returns NULL, the condition is false, and the loop stops. The end of the input has a name: **EOF**, short for "end of file"

---

How does the input end? When a program reads a file, the end of the file is the end. When we type, we have to say it ourselves: on Linux, we press Ctrl + D at the start of an empty line. Here, after you press Run and type your lines, press **End input** under the output box. It does the same thing

---

An empty line is not the end. For an empty line, fgets gives back a string with only the `'\n'` in it, and after we cut the newline, an empty string with length 0. Only EOF stops the loop

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char lines[3][16] = { "reel 7", "", "reel 9" };
    for (int i = 0; i < 3; i++) {
        char *line = lines[i];
        if (strlen(line) == 0) {
            printf("an empty line\n");
        } else {
            printf("%s\n", line);
        }
    }
    return 0;
}
```

Output

```text
reel 7
an empty line
reel 9
```

---

scanf can read until the end too. It returns how many values it managed to read. While there are numbers, that's 1. At the end, it can't read anything and returns **EOF**, which is -1

```c
#include <stdio.h>

int main(void) {
    int x;
    int sum = 0;
    while (scanf("%d", &x) == 1) {
        sum = sum + x;
    }
    printf("Sum: %d\n", sum);
    return 0;
}
```

Input

```text
10 20
30
```

Output

```text
Sum: 60
```

Checking `== 1` is safer than checking for EOF: if the input has a word where a number should be, scanf returns 0, and the loop stops too, instead of running forever

---

## Mission: The Night Shift Log

During the night, the operators write everything into a log, one line at a time. Some lines are empty, left between two jobs. In the morning, the shift chief wants the log printed again with line numbers, but without the empty lines, and a short count at the end

1. Read lines with fgets until the input ends. You don't know how many there are
2. For each line that is not empty, print its number in the log and the line, as in the example. Empty lines count in the numbering, but don't print them
3. At the end, print how many lines the log had, and how many of them were empty

An empty line has nothing on it, not even a space. Each line has at most 100 characters, and the log has from 1 to 200 lines

**Example**

Input

```text
start job 12

tape 3 loaded
end
```

Output

```text
1: start job 12
3: tape 3 loaded
4: end
Lines: 4
Empty: 1
```
