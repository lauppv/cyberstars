Every process carries a small list of named text values, called **environment variables**. They're like settings that travel with the process: where its home folder is, which language it speaks, where to look for programs. Each one is a name and a value, like `HOME=/home/ada`

When a process makes a child with fork, the child gets a copy of the list. When it runs another program with exec, that program keeps the list too. So a setting given to the first process reaches everything it starts

---

**getenv**, from stdlib.h, reads one variable by its name. It returns its value as a string, or NULL if there is no such variable

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *path = getenv("PATH");
    char *missing = getenv("NO_SUCH_SETTING");

    printf("%s\n", path != NULL ? "PATH is set" : "PATH is missing");
    printf("%s\n", missing != NULL ? "found" : "not set");
    return 0;
}
```

Output

```text
PATH is set
not set
```

**PATH** is the one we've met already without knowing it: a list of folders separated by `:`. When execvp gets a name like "echo", it looks for it in each of those folders, in order

---

**setenv** adds a variable or changes it, and **unsetenv** removes it. The third argument of setenv says what to do if the name already exists: 1 means "replace it", 0 means "keep the old value"

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    setenv("SHIFT", "day", 1);
    setenv("SHIFT", "night", 0);
    printf("%s\n", getenv("SHIFT"));

    setenv("SHIFT", "night", 1);
    printf("%s\n", getenv("SHIFT"));

    unsetenv("SHIFT");
    printf("%s\n", getenv("SHIFT") == NULL ? "gone" : "still here");
    return 0;
}
```

Output

```text
day
night
gone
```

---

Changes only go down, never up. A child sees what its parent had when it was made. But if the child changes a variable, the parent never sees it: the child changed its own copy

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>

int main(void) {
    setenv("ROOM", "B12", 1);
    fflush(stdout);
    if (fork() == 0) {
        printf("child sees %s\n", getenv("ROOM"));
        setenv("ROOM", "C7", 1);
        fflush(stdout);
        _exit(0);
    }
    wait(NULL);
    printf("parent still has %s\n", getenv("ROOM"));
    return 0;
}
```

Output

```text
child sees B12
parent still has B12
```

That's also why a program can never change the environment of the shell that started it

---

## Mission: The Shift Settings

The shift chief keeps the night settings in environment variables, and wants to check that the programs started for the shift really get them

1. Read commands, one per line, until the input ends
   - `set name value`: set the variable, replacing an old value
   - `unset name`: remove the variable
   - `get name`: print `name=value`, or `name is not set`
   - `child name`: start the program printenv with the name as its argument, with fork and exec, and wait for it. printenv prints the value and exits with 0, or prints nothing and exits with 1 when the variable is not set. When it exits with 1, print `name is not set in the child`
2. Call fflush(stdout) before every fork

Names are in capital letters, at most 20 characters. Values are one word of at most 30 characters

**Example**

Input

```text
set SHIFT night
get SHIFT
child SHIFT
unset SHIFT
get SHIFT
child SHIFT
```

Output

```text
SHIFT=night
night
SHIFT is not set
SHIFT is not set in the child
```
