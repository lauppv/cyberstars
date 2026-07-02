In the **if-else** lesson we saw a small surprise: **C doesn't have a native boolean type**. It uses **integers**, where **0** means **false** and **anything else** means **true**

```c
#include <stdio.h>

int main(void) {
    int is_user_online = 1;   // "true"
    int is_hidden = 0;        // "false"

    if (is_user_online) {
        printf("online\n");
    }
    return 0;
}
```

This works, but reading **int is_user_online = 1** is awkward. It looks like a counter, not a true/false value

---

The good news: starting with C99, the standard library gives us a real boolean type

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool is_online = true;
    bool has_key = false;

    printf("%d\n", is_online);   // 1
    printf("%d\n", has_key);     // 0

    return 0;
}
```

After we **#include <stdbool.h>**, three new identifiers exist: **bool**, **true**, and **false**

Behind the scenes, **bool** is still essentially an int — **true** is **1**, **false** is **0** — but the names make our code much more **readable**. From now on, when something can only be true or false, prefer **bool** over **int**

There is no special format specifier for **bool** in **printf** — just use **%d** (it will print **0** or **1**)

---

We can combine booleans with logical operators

- **&&** → **and** (both must be true)
- **||** → **or** (at least one must be true)
- **!** → **not** (flips the value)

A real example: in order to drive a car, you need to be **at least 18 AND have a license**

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    int age = 20;
    bool has_license = true;

    if (age >= 18 && has_license) {
        printf("You can drive\n");
    } else {
        printf("Sorry, no driving today\n");
    }

    return 0;
}
```

---

**||** is more relaxed. Just one of the conditions being true is enough

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool is_vip = false;
    bool has_invitation = true;

    if (is_vip || has_invitation) {
        printf("Welcome to the club\n");
    } else {
        printf("Access denied\n");
    }
    return 0;
}
```

---

**!** flips a boolean. **!true** becomes **false**, and vice versa

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool is_logged_in = false;
    if (!is_logged_in) {
        printf("Please log in first\n");
    }
    return 0;
}
```

---

## Mission: Access to the Computer Room

The data center's computer room locks itself automatically. The gate runs a panel that decides who gets in: a person can pass if they are an **employee AND it is a working day**, OR if they are a **guest WITH an invitation**.

Read four integers (**0** or **1**), separated by space, in this order: **is_employee**, **is_working_day**, **is_guest**, **has_invitation**. Write an **if / else** using `&&` and `||` that prints the correct verdict

**Example**

Input

```text
1 1 0 0
```

Output

```text
Access granted
```

**Example**

Input

```text
0 0 1 0
```

Output

```text
Access denied
```
