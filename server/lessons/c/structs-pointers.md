When we pass a struct to a function, C copies the **entire struct**. For a small struct that's fine. But for a struct with a 1000-character buffer and dozens of fields, copying is wasteful. The solution: **pass a pointer to the struct**

```c
#include <stdio.h>
#include <string.h>

struct Terminal {
    char id[50];
    int sessions;
    int errors;
};

void print_terminal(struct Terminal *p) {
    printf("%s: %d sessions, %d errors\n", (*p).id, (*p).sessions, (*p).errors);
}

int main(void) {
    struct Terminal t = {"tty7", 3, 0};
    print_terminal(&t);
    return 0;
}
```

We pass **&t** (the address of the struct), and the function receives a **struct Terminal \***. To access fields through a pointer, we write **(\*p).sessions** — first dereference, then access the field

---

Writing **(\*p).sessions** everywhere is ugly. C gives us a shortcut: the **arrow operator ->**

```c
#include <stdio.h>

struct Terminal {
    char id[50];
    int sessions;
    int errors;
};

void print_terminal(struct Terminal *p) {
    printf("%s: %d sessions, %d errors\n", p->id, p->sessions, p->errors);
}

int main(void) {
    struct Terminal t = {"tty7", 3, 0};
    print_terminal(&t);
    return 0;
}
```

**p->sessions** is exactly the same thing as **(\*p).sessions**. It's cleaner and everyone uses it. The rule is simple: **dot** for structs, **arrow** for pointers to structs

---

The real power: functions that **modify** a struct through a pointer

```c
#include <stdio.h>

struct Terminal {
    char id[50];
    int sessions;
    int errors;
};

void log_error(struct Terminal *p) {
    p->errors += 1;
    if (p->errors >= 3) {
        p->sessions = 0;
    }
}

void open_session(struct Terminal *p) {
    p->sessions += 1;
}

int main(void) {
    struct Terminal t = {"tty7", 0, 0};
    open_session(&t);
    open_session(&t);
    log_error(&t);
    printf("%s: %d sessions, %d errors\n", t.id, t.sessions, t.errors);
    return 0;
}
```

Output: **tty7: 2 sessions, 1 errors**

The functions modified the **original struct**, not a copy. It's the same "pass by reference" pattern we learned with pointers to int, but now with structs. This is how real C programs manage state

---

## Mission: Compute-Time Account Ledger

The computing center bills processor time by the hour. Each user has an account with a balance in hours, and shift operators make allocations and withdrawals throughout the day. All updates must go through a pointer, so the original balance in the ledger changes in place.

1. Define a struct **HourAccount** with fields **owner** (char array) and **balance** (int)
2. Write the function **void allocate(struct HourAccount \*acc, int hours)** — adds hours to the balance through the pointer
3. Write the function **void withdraw(struct HourAccount \*acc, int hours)** — subtracts hours from the balance if there's enough, otherwise print **"Insufficient funds"**
4. Read from input: the owner's name, the initial balance, then three operations. Each operation has a code (**1** = allocate, **2** = withdraw) followed by a value
5. After all operations, print **"Balance: X"**

**Example**

Input

```text
op7
1000
1 500
2 200
2 2000
```

Output

```text
Insufficient funds
Balance: 1300
```

**Example**

Input

```text
op12
200
2 50
1 100
2 300
```

Output

```text
Insufficient funds
Balance: 250
```
