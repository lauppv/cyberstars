This is the lesson that separates C from almost every other language. **Pointers**. They sound scary, but once you understand the idea, they're actually quite elegant

A **pointer** is a variable that stores the **address** of another variable. Think of it like this: every variable lives somewhere in memory, at a specific **address**. A pointer is a piece of paper where you wrote down that address

```c
#include <stdio.h>

int main(void) {
    int age = 25;
    int *ptr = &age;

    printf("Value of age: %d\n", age);
    printf("Address of age: %p\n", (void *)&age);
    printf("Value of ptr: %p\n", (void *)ptr);
    printf("Value at ptr: %d\n", *ptr);
    return 0;
}
```

Two new operators:

- **&** — the **address-of** operator. **&age** gives us the **address** where `age` is stored in memory
- **\*** — the **dereference** operator. **\*ptr** gives us the **value** at the address stored in `ptr`

So **&age** gives the address, **\*ptr** reads the value at that address. They're like inverses of each other

---

The declaration **int \*ptr** says "ptr is a pointer to an int". The **\*** here is part of the **type**, not the dereference operator. It's confusing at first, but you get used to it

```c
#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;    // p points to x

    printf("%d\n", *p);   // 10 — the value at the address p holds
    return 0;
}
```

We can also **change** the value through the pointer

```c
#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;
    *p = 42;
    printf("%d\n", x);   // 42 — x changed!
    return 0;
}
```

We didn't touch **x** directly. We went through **p**, followed the address, and changed the value there. Since **p** points to **x**, changing **\*p** changes **x**. This is the power of pointers

---

A useful analogy: think of a **Google Maps pin**. The pin isn't the restaurant — it's a **reference to** the restaurant. If you share the pin with someone and they go there and repaint the building, the restaurant changed, even though you didn't go there yourself. That's what a pointer does

---

Different types of pointers for different types:

```c
#include <stdio.h>

int main(void) {
    int a = 10;
    int *ip = &a;       // pointer to int

    double b = 3.14;
    double *dp = &b;    // pointer to double

    char c = 'A';
    char *cp = &c;      // pointer to char

    printf("%d %f %c\n", *ip, *dp, *cp);
    return 0;
}
```

The pointer type must match the type it points to. An **int \*** can only point to an **int**. This is how C knows how many bytes to read when you dereference

---

## Mission: Remote Valve Override

A pressure valve on Deck 7 is stuck. You can't reach it physically, but you have a pointer to its control register. Use the pointer to change the valve setting remotely.

1. Declare an **int** variable **x** with value **7**
2. Create a pointer **ptr** that points to **x**
3. Use the pointer to change **x** to **42** (assign through **\*ptr**)
4. Print both **x** and **\*ptr**

**Input** (already set at the top of your code — change the values to test):

- `x` — an int with initial value **7**

**Example**

With the starter values, your program should print

```text
42
42
```
