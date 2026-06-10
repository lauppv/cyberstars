Sometimes we have a variable that can only be one of a few **named values**: a day of the week, a direction, a game state. We could use ints (0 = UP, 1 = DOWN...) but that's unreadable. **Enums** give names to these constants

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

Under the hood, **UP** is **0**, **DOWN** is **1**, **LEFT** is **2**, **RIGHT** is **3**. The compiler assigns numbers starting from 0 automatically. But we write **UP** instead of **0**, which makes the code much clearer

---

We can choose our own values if we want

```c
#include <stdio.h>

enum HttpStatus {
    OK = 200,
    NOT_FOUND = 404,
    SERVER_ERROR = 500
};

int main(void) {
    enum HttpStatus code = NOT_FOUND;
    printf("Status: %d\n", code);   // Status: 404
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

A classic use: game states

```c
#include <stdio.h>

enum GameState { MENU, PLAYING, PAUSED, GAME_OVER };

int main(void) {
    enum GameState state = MENU;
    // player presses start
    state = PLAYING;
    // player presses escape
    state = PAUSED;
    printf("%d\n", state);
    return 0;
}
```

Instead of remembering "was 2 paused or game over?", we just use the name. The code reads like English

---

## Mission: Climate Module

The station orbits a planet with four distinct seasons. The climate module needs a function that translates each season code into a human-readable name for the crew display.

The **enum Season** and the **print_season** function skeleton are already on the right. Fill in the **switch** statement so each case prints the season name.

**Example**

Your program should print

```text
Spring
Summer
Autumn
Winter
```
