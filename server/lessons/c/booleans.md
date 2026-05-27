In the **if-else** lesson we saw a small surprise: **C doesn’t have a native boolean type**. It uses **integers**, where **0** means **false** and **anything else** means **true**

```c
#include <stdio.h>

int main(void) {
    int isUserOnline = 1;   // "true"
    int isHidden = 0;       // "false"

    if (isUserOnline) {
        printf("online\n");
    }
    return 0;
}
```

This works, but reading **int isUserOnline = 1** is awkward. It looks like a counter, not a true/false value

---

The good news: since C99, the standard library gives us a real boolean type

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool isOnline = true;
    bool hasKey = false;

    printf("%d\n", isOnline);   // 1
    printf("%d\n", hasKey);     // 0

    return 0;
}
```

After we **#include <stdbool.h>**, three new identifiers exist: **bool**, **true**, and **false**

Behind the scenes, **bool** is still essentially an int — **true** is **1**, **false** is **0** — but the names make our code much more **readable**. From now on, when something can only be true or false, prefer **bool** over **int**

There is no special format specifier for **bool** in **printf** — just use **%d** (it’ll print **0** or **1**)

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
    bool hasLicense = true;

    if (age >= 18 && hasLicense) {
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
    bool isVIP = false;
    bool hasInvitation = true;

    if (isVIP || hasInvitation) {
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
    bool isLoggedIn = false;
    if (!isLoggedIn) {
        printf("Please log in first\n");
    }
    return 0;
}
```

---

You are writing the access system for **CyberStars HQ**. A person can enter if they are an **employee AND it’s a working day**, or if they are a **guest WITH an invitation**

You have these variables on the right

```c
#include <stdio.h>
#include <stdbool.h>

int main(void) {
    bool isEmployee = true;
    bool isWorkingDay = true;
    bool isGuest = false;
    bool hasInvitation = false;
    return 0;
}
```

Display **Access granted** if the person can enter, **Access denied** otherwise

Don’t forget the **#include <stdbool.h>** — it’s already there for you :)
