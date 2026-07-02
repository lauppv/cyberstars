So far we've stored simple values: an int, a char, a string. But what if we want to represent an **employee** of the computing center, with a name, a shift, and a number of tasks completed? We could use three separate variables, but things get messy fast when we have dozens of employees. Enter **structs**

A **struct** is a way to group related data into a single type. Think of it as a custom box that holds several fields

```c
#include <stdio.h>
#include <string.h>

struct Employee {
    char name[50];
    int shift;
    int tasks;
};

int main(void) {
    struct Employee e1;
    strcpy(e1.name, "op7");
    e1.shift = 2;
    e1.tasks = 0;

    printf("Name: %s\n", e1.name);
    printf("Shift: %d\n", e1.shift);
    printf("Tasks: %d\n", e1.tasks);
    return 0;
}
```

We **define** the struct with **struct Employee { ... };** — notice the **semicolon** after the closing brace. Then we **create** a variable of that type with **struct Employee e1**. We access fields with the **dot operator**: **e1.shift**

---

We can also initialize a struct all at once

```c
#include <stdio.h>

struct Employee {
    char name[50];
    int shift;
    int tasks;
};

int main(void) {
    struct Employee e1 = {"op7", 2, 5};
    printf("%s: shift %d, %d tasks\n", e1.name, e1.shift, e1.tasks);
    return 0;
}
```

The values fill in the fields **in order**: name, shift, tasks. Or, more explicitly

```c
#include <stdio.h>

struct Employee {
    char name[50];
    int shift;
    int tasks;
};

int main(void) {
    struct Employee e1 = {.name = "op7", .shift = 2, .tasks = 5};
    printf("%s: shift %d, %d tasks\n", e1.name, e1.shift, e1.tasks);
    return 0;
}
```

This second form is clearer — you see exactly which value goes into which field

---

Arrays of structs are super useful

```c
#include <stdio.h>

struct Employee {
    char name[50];
    int shift;
    int tasks;
};

int main(void) {
    struct Employee team[3] = {
        {"op7", 1, 5},
        {"op12", 2, 3},
        {"op9", 3, 8}
    };

    for (int i = 0; i < 3; i++) {
        printf("%s: shift %d, %d tasks\n", team[i].name, team[i].shift, team[i].tasks);
    }
    return 0;
}
```

Output

```text
op7: shift 1, 5 tasks
op12: shift 2, 3 tasks
op9: shift 3, 8 tasks
```

---

## Mission: Magnetic Tape Archive Inventory

The computing center's archive tracks every reel of magnetic tape used to store programs and results. The archive chief wants a quick report, generated straight from the intake log.

1. Define a struct **Tape** with fields: **label** (char array), **year** (int), **meters** (int)
2. Read **two** tapes from input: on each line, a label (a single word, no spaces), a year, and a length in meters
3. Print each tape in the format **"Label (Year) - Meters m"**

**Example**

Input

```text
IBM7090 1969 730
DEC10 1972 500
```

Output

```text
IBM7090 (1969) - 730 m
DEC10 (1972) - 500 m
```

**Example**

Input

```text
UNIVAC 1965 900
PDP7 1970 250
```

Output

```text
UNIVAC (1965) - 900 m
PDP7 (1970) - 250 m
```
