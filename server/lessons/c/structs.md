So far we've stored single values: an int, a char, a string. But what if we want to represent a **player** with a name, health, and score? We could use three separate variables, but that gets messy fast. Enter **structs**

A **struct** is a way to group related data together into a single type. Think of it as a custom box that holds multiple things

```c
#include <stdio.h>
#include <string.h>

struct Player {
    char name[50];
    int health;
    int score;
};

int main(void) {
    struct Player p1;
    strcpy(p1.name, "Tommy");
    p1.health = 100;
    p1.score = 0;

    printf("Name: %s\n", p1.name);
    printf("Health: %d\n", p1.health);
    printf("Score: %d\n", p1.score);
    return 0;
}
```

We **define** the struct with **struct Player { ... };** — notice the **semicolon** after the closing brace. Then we **create** a variable of that type with **struct Player p1**. We access fields with the **dot operator**: **p1.health**

---

If you know Java, a struct is similar to a class with only public fields and no methods. If you know Python, think of it as a simple object with just attributes. C doesn't have classes or methods — structs are our tool for organizing data

---

We can also initialize a struct all at once

```c
#include <stdio.h>

struct Player {
    char name[50];
    int health;
    int score;
};

int main(void) {
    struct Player p1 = {"Vercetti", 100, 500};
    printf("%s: %d HP, %d pts\n", p1.name, p1.health, p1.score);
    return 0;
}
```

The values fill in the fields **in order**: name, health, score. Or, more explicitly

```c
#include <stdio.h>

struct Player {
    char name[50];
    int health;
    int score;
};

int main(void) {
    struct Player p1 = {.name = "Vercetti", .health = 100, .score = 500};
    printf("%s: %d HP, %d pts\n", p1.name, p1.health, p1.score);
    return 0;
}
```

This second form is clearer — you see exactly which field gets which value

---

Arrays of structs are super useful

```c
#include <stdio.h>

struct Player {
    char name[50];
    int health;
    int score;
};

int main(void) {
    struct Player team[3] = {
        {"Tommy", 100, 500},
        {"Lance", 80, 300},
        {"Ken", 60, 100}
    };

    for (int i = 0; i < 3; i++) {
        printf("%s: %d HP, %d pts\n", team[i].name, team[i].health, team[i].score);
    }
    return 0;
}
```

Output

```text
Tommy: 100 HP, 500 pts
Lance: 80 HP, 300 pts
Ken: 60 HP, 100 pts
```

---

## Mission: Fleet Inventory Report

The station's hangar bay needs a quick inventory of its shuttles. Define a struct to represent each vehicle and print a formatted manifest for Commander Lance.

1. Define a struct **Car** with fields: **brand** (char array), **year** (int), **km** (int)
2. Create **two** cars with the values shown below
3. Print each one in the format **"Brand (Year) - Km km"**

**Input** (already set at the top of your code — change the values to test):

- Car 1: **"BMW"**, **2015**, **120000**
- Car 2: **"Dacia"**, **2020**, **45000**

**Example**

With the starter values, your program should print

```text
BMW (2015) - 120000 km
Dacia (2020) - 45000 km
```
