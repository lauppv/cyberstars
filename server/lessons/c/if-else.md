In real life we make decisions: **if** it’s cold, take a sweater, **otherwise** a t-shirt is enough. **If** I’m sleepy I sleep, **otherwise** I program :)

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

The C syntax is **almost identical** to Java
- The condition goes in **parentheses** **( )**
- The body goes inside **braces** **{ }**
- No **:** at the end like Python

If **age** is less than **18**, we enter the **if** block. Otherwise we enter the **else**. Run the code, change the age, see what happens

---

The comparison operators

- **<** less than
- **<=** less than or equal
- **>** greater than
- **>=** greater than or equal
- **==** equal (note **two** equals signs)
- **!=** not equal

**Be very careful** about **=** vs **==**. **=** assigns, **==** compares
```c
int x = 4;
if (x = 4) {
    printf("Boo\n");
}
```
This is a **classic C bug**. Unlike Java (which refuses to compile this), **C accepts it without an error**. **x = 4** stores **4** in **x** and gives back the value **4**, which C treats as "true" (any non-zero value is true). So this code always enters the **if**, no matter what **x** was before. Many real-world bugs in famous projects come from exactly this typo. Use **==** when comparing :)

---

We don’t always need **else**. Sometimes we just want to act **if** something is true and otherwise do nothing
```c
int isUserOnline = 1;
if (isUserOnline) {
    printf("Welcome back\n");
}
```

Wait, **isUserOnline = 1**? Where is **true**? Well, **C doesn’t have a real boolean type by default**. It uses integers: **0** means **false**, **anything else** (1, 2, -5, ...) means **true**. We’ll see a real **bool** type in a later lesson, with **#include <stdbool.h>**

---

A complete example
```c
#include <stdio.h>

int main(void) {
    int isUserOnline = 1;

    if (isUserOnline) {
        printf("Tommy Vercetti is playing GTA Vice City\n");
    } else {
        printf("Tommy Vercetti is offline\n");
    }

    return 0;
}
```
Change **isUserOnline** to **0** and run again. The output flips. Programming becomes fun the moment you start **playing** with the values :)

---

Write a program that displays **it's freezing outside** if **temperature** is below **0**, or **water does not freeze** otherwise
