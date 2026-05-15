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
void printPlayer(struct Player *p) {
    printf("%s: %d HP, %d pts\n", p->name, p->health, p->score);
}
```

**p->health** is exactly the same as **(\*p).health**. It's cleaner and everyone uses it. The rule is simple: **dot** for structs, **arrow** for pointers to structs

---

The real power: functions that **modify** a struct through a pointer
```c
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

Define a struct **BankAccount** with fields **owner** (char array) and **balance** (int)

Write a function **deposit** that takes a pointer to a BankAccount and an amount, and adds the amount to the balance

Write a function **withdraw** that takes a pointer to a BankAccount and an amount. If the balance is enough, subtract the amount. Otherwise, print **"Insufficient funds"**

In **main**, create an account for "Lance" with balance 1000. Deposit 500. Withdraw 200. Withdraw 2000 (should fail). Print the final balance

Expected output
```text
Insufficient funds
Balance: 1300
```
