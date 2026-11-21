A function's code sits in memory too, so a function has an address, just like a variable. We can keep that address in a pointer, and call the function through it. This is a **function pointer**

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int main(void) {
    int (*op)(int, int) = add;
    printf("%d\n", op(6, 7));

    op = multiply;
    printf("%d\n", op(6, 7));
    return 0;
}
```

Output

```text
13
42
```

---

The declaration looks strange, so let's read it slowly

```text
int (*op)(int, int)
```

- `*op`: op is a pointer
- `(int, int)`: to a function that takes two ints
- `int` at the front: and returns an int

The parentheses around `*op` matter. Without them, `int *op(int, int)` would be a function that returns a pointer to int, something very different

The name of a function, written without parentheses, is its address. That's why `op = multiply` works, and `op(6, 7)` calls whatever function op points to now

---

The real power: we can give a function to another function. The receiving function doesn't need to know which one it got. It just calls it

```c
#include <stdio.h>

int twice(int x) {
    return x * 2;
}

int square(int x) {
    return x * x;
}

void apply(int v[], int n, int (*f)(int)) {
    for (int i = 0; i < n; i++) {
        v[i] = f(v[i]);
    }
}

int main(void) {
    int v[] = { 1, 2, 3, 4 };
    apply(v, 4, twice);
    apply(v, 4, square);
    for (int i = 0; i < 4; i++) {
        printf("%d ", v[i]);
    }
    printf("\n");
    return 0;
}
```

Output

```text
4 16 36 64
```

apply walks the array once, and we decide what happens to each value. A function given like this is called a **callback**: apply calls it back for every value

---

The type is long to write again and again. typedef gives it a short name

```c
#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

typedef int (*operation)(int, int);

int main(void) {
    operation ops[] = { add, multiply };
    printf("%d\n", ops[1](6, 7));
    return 0;
}
```

Output

```text
42
```

Now `operation` is a type, like int. Here we even made an array of function pointers: `ops[1](6, 7)` calls multiply. Tables like this let a program pick a function by a number, without a long if/else chain

---

## Mission: The Tape Filter

A long tape of readings comes from the sensors. The technicians keep asking different questions about it: how many readings are even, how many are above zero, how many are bigger than 100. Instead of writing a new loop for each question, write one loop that takes the question as a function

1. Write **int count_if(int v[], int n, int (\*test)(int))** that returns how many values make test return something other than 0
2. Write three small test functions: **is_even**, **is_positive** and **is_big** (bigger than 100). Each takes an int and returns 1 or 0
3. Read a whole number n, then n readings
4. Print the three counts, as in the example, each one found by calling count_if with a different test

n is from 1 to 1000, and each reading is from -1000 to 1000

**Example**

Input

```text
6
4 -3 150 0 101 -8
```

Output

```text
Even: 4
Positive: 3
Big: 2
```

Zero is even, but it's not positive
