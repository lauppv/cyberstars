In real life we make decisions: **if** it's cold, take a sweater, **otherwise** a t-shirt is enough. **If** I'm sleepy, I sleep, **otherwise** I code

In C we say

```c
#include <stdio.h>

int main(void) {
    int age = 18;

    if (age < 18) {
        printf("Access denied because you are not 18 years old\n");
    } else {
        printf("Welcome to the club\n");
    }

    return 0;
}
```

A few syntax rules

- The condition goes between **parentheses** **( )**
- The body goes between **braces** **{ }**
- There is no **:** at the end

If **age** is less than **18**, we enter the **if** block. Otherwise we enter **else**. Run the code, change the age, see what happens

---

The comparison operators

- **<** less than
- **<=** less than or equal
- **>** greater than
- **>=** greater than or equal
- **==** equal (careful, **two** equal signs)
- **!=** **not** equal

**Be very careful** about the difference between **=** and **==**. **=** assigns, **==** compares

```c
#include <stdio.h>

int main(void) {
    int x = 4;
    if (x = 4) {
        printf("Boo\n");
    }
    return 0;
}
```

This is a **classic C bug**: **C accepts this code without any compile error**. **x = 4** stores **4** in **x** and returns the value **4**, which C treats as "true" (any non-zero value means true). So the code always enters the **if**, no matter what **x** was before. Many famous bugs in real-world projects come from exactly this typo. Use **==** when comparing

---

We don't always need **else**. Sometimes we just want to do something **if** a condition is true, and otherwise do nothing

```c
#include <stdio.h>

int main(void) {
    int user_online = 1;
    if (user_online) {
        printf("Welcome back\n");
    }
    return 0;
}
```

Wait, **user_online = 1**? Where is **true**? Well, **C doesn't have a true boolean type by default**. It uses whole numbers: **0** means **false**, **anything else** (1, 2, -5, ...) means **true**. We'll see a real **bool** type in a future lesson, with **#include <stdbool.h>**

---

A complete example

```c
#include <stdio.h>

int main(void) {
    int terminal_connected = 1;

    if (terminal_connected) {
        printf("Session open\n");
    } else {
        printf("Terminal disconnected\n");
    }

    return 0;
}
```

Change **terminal_connected** to **0** and run again. The result flips. Programming becomes interesting the moment you start **playing** with values

---

## Mission: Machine Room Thermostat

The computing center's mainframes don't tolerate cold: below zero degrees, the oil in the tape units jams the mechanisms. The thermostat has to warn the shift operator.

Write a program that, inside **main**

- declares an **int** named **temperature**
- uses an **if / else**: if `temperature` is **less than 0** → print `cold alert`, otherwise → print `temperature normal`

**Example**

For a **temperature** of -5, your program would print something like

```text
cold alert
```
