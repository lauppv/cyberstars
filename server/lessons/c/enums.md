Sometimes we have a variable that can only be one of a few **named values**: a day of the week, a direction, a job state. We could use ints (0 = UP, 1 = DOWN...) but that's unreadable. **Enums** give names to these constants

```c
#include <stdio.h>

enum Direction { UP, DOWN, LEFT, RIGHT };

int main(void) {
    enum Direction d = UP;

    if (d == UP) {
        printf("Going up!\n");
    }
    return 0;
}
```

Behind the scenes, **UP** is **0**, **DOWN** is **1**, **LEFT** is **2**, **RIGHT** is **3**. The compiler assigns numbers automatically starting from 0. But we write **UP** instead of **0**, which makes the code much clearer

---

We can pick our own values if we want

```c
#include <stdio.h>

enum ExitCode {
    SUCCESS = 0,
    READ_ERROR = 1,
    MEMORY_ERROR = 2
};

int main(void) {
    enum ExitCode code = READ_ERROR;
    printf("Exit code: %d\n", code);   // Exit code: 1
    return 0;
}
```

---

Enums work great with **switch**

```c
#include <stdio.h>

enum Color { RED, GREEN, BLUE };

void print_color(enum Color c) {
    switch (c) {
        case RED:   printf("Red\n");   break;
        case GREEN: printf("Green\n"); break;
        case BLUE:  printf("Blue\n");  break;
    }
}

int main(void) {
    print_color(RED);
    print_color(GREEN);
    print_color(BLUE);
    return 0;
}
```

This is much better than `if (c == 0)` — anyone reading the code knows exactly what RED means

---

A classic use: the states of a job in the processing queue

```c
#include <stdio.h>

enum JobState { QUEUED, RUNNING, SUSPENDED, DONE };

int main(void) {
    enum JobState state = QUEUED;
    // the operator starts the job
    state = RUNNING;
    // the operator suspends it for a priority job
    state = SUSPENDED;
    printf("%d\n", state);
    return 0;
}
```

Instead of remembering "was 2 suspended or done?", we simply use the names. The code reads almost like plain English

---

## Mission: The Maintenance Calendar

The computing center runs a quarterly maintenance cycle, one round per season. The operating console needs a function that translates each season code into a readable name on the teletype screen.

1. Define **enum Season** with values **SPRING**, **SUMMER**, **AUTUMN**, **WINTER**
2. Write the function **void print_season(enum Season s)** with a **switch** statement that prints the season's name
3. In **main**, call the function for all four seasons, in order

**Example**

Your program should print

```text
Spring
Summer
Autumn
Winter
```
