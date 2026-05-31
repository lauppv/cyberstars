When we pass a struct to a function, C copies the **entire struct**. For a small struct that's fine. But for a struct with a 1000-char name and dozens of fields, copying is wasteful. The solution: **pass a pointer to the struct**

```c
#include <stdio.h>
#include <string.h>

struct Player {
    char name[50];
    int health;
    int score;
};

void printPlayer(struct Player *p) {
    printf("%s: %d HP, %d pts\n", (*p).name, (*p).health, (*p).score);
}

int main(void) {
    struct Player t = {"Tommy", 100, 500};
    printPlayer(&t);
    return 0;
}
```

We pass **&t** (the address of the struct), and the function receives a **struct Player \***. To access fields through a pointer, we write **(\*p).health** — first dereference, then access the field

---

Writing **(\*p).health** everywhere is ugly. C gives us a shortcut: the **arrow operator ->**

```c
#include <stdio.h>

struct Player {
    char name[50];
    int health;
    int score;
};

void printPlayer(struct Player *p) {
    printf("%s: %d HP, %d pts\n", p->name, p->health, p->score);
}

int main(void) {
    struct Player t = {"Tommy", 100, 500};
    printPlayer(&t);
    return 0;
}
```

**p->health** is exactly the same as **(\*p).health**. It's cleaner and everyone uses it. The rule is simple: **dot** for structs, **arrow** for pointers to structs

---

The real power: functions that **modify** a struct through a pointer

```c
#include <stdio.h>

struct Player {
    char name[50];
    int health;
    int score;
};

void takeDamage(struct Player *p, int dmg) {
    p->health -= dmg;
    if (p->health < 0) {
        p->health = 0;
    }
}

void addScore(struct Player *p, int points) {
    p->score += points;
}

int main(void) {
    struct Player t = {"Tommy", 100, 0};
    takeDamage(&t, 30);
    addScore(&t, 200);
    printf("%s: %d HP, %d pts\n", t.name, t.health, t.score);
    return 0;
}
```

Output: **Tommy: 70 HP, 200 pts**

The functions modified the **original struct**, not a copy. This is the same "pass by reference" pattern we learned with int pointers, but now with structs. This is how real C programs manage state

---

## Mission: Station Credit System

The station's treasury module needs two core functions: deposit and withdraw. Crew accounts are stored as structs, and all updates go through pointers so the original balance changes in place.

1. The struct **BankAccount** (with **owner** and **balance**) is already defined on the right
2. Complete the **deposit** function: add the amount to the balance via the pointer
3. Complete the **withdraw** function: subtract the amount if the balance is enough, otherwise print **"Insufficient funds"**

**Input** (already set at the top of your code — change the values to test):

- Account owner: **"Lance"**, starting balance: **1000**
- Operations: deposit **500**, withdraw **200**, withdraw **2000**

**Example**

With the starter values, your program should print

```text
Insufficient funds
Balance: 1300
```
