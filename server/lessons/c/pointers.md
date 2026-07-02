This is the lesson that separates C from almost every other language. **Pointers**. They sound scary, but once you understand the idea, they're actually quite elegant

A **pointer** is a variable that stores the **address** of another variable. Think of it like this: every variable lives somewhere in the computer's memory, at a specific **address** — a number, just like a room number in an office building. A pointer is a piece of paper where you wrote down that room number

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

    printf("%d\n", *p);   // 10 - the value at the address p holds
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
    printf("%d\n", x);   // 42 - x changed!
    return 0;
}
```

Let's trace what happens:

1. **x** is created with value 10, somewhere in memory
2. **p** is a pointer that receives the address of **x** — now **p** "knows" where **x** lives
3. **\*p = 42** doesn't change the pointer, it goes to the address in **p** and writes 42 there
4. since **p** held the address of **x**, the value written there is **x** itself

We didn't touch **x** directly. We went through **p**, followed the address, and changed the value there. This is the power of pointers

---

On the early UNIX systems at Bell Labs, programmers worked with memory at exactly this level: every byte had an address, and a wrong pointer could write over another program's memory. This is why C keeps you this close to the machine — and why you have to pay attention to which pointer you're reading and which one you're writing

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
    char *cp = &c;       // pointer to char

    printf("%d %f %c\n", *ip, *dp, *cp);
    return 0;
}
```

The pointer type must match the type it points to. An **int \*** can only point to an **int**. This is how C knows how many bytes to read when you dereference

---

## Mission: The Tape Drive Control Register

You're the shift operator at the computing center. A magnetic tape reader sent you an initial value for its control register, but the new command has to be written through a pointer — direct hardware access isn't allowed, only through an address.

1. Read an **int** **x** from input
2. Create a pointer **ptr** that points to **x**
3. Use the pointer to change **x** to **42** (assign through **\*ptr**)
4. Print both **x** and **\*ptr**, each on its own line

**Example**

Input

```text
7
```

Output

```text
42
42
```

**Example**

Input

```text
100
```

Output

```text
42
42
```

No matter what value **x** has when it's read, after you write through the pointer, **x** becomes **42**.
