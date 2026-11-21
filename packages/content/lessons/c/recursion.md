A function can call other functions. It can also call itself. This is called **recursion**, and it's a way to solve a big problem by solving a smaller copy of the same problem

```c
#include <stdio.h>

void countdown(int n) {
    if (n == 0) {
        printf("Launch\n");
        return;
    }
    printf("%d\n", n);
    countdown(n - 1);
}

int main(void) {
    countdown(3);
    return 0;
}
```

Output

```text
3
2
1
Launch
```

countdown(3) prints 3, then asks countdown(2) to do the rest. That one prints 2 and asks countdown(1), and so on, until countdown(0) prints Launch and stops

---

Every recursive function needs two parts

1. A **base case**: a small problem we can answer right away, with no more calls. Here, n == 0
2. A **recursive step**: a call to itself, on a problem that is a bit smaller. Here, n - 1

Each call must get closer to the base case. If it doesn't, the calls never end

---

A classic: the factorial. 5! is 5 × 4 × 3 × 2 × 1. Look closer and 5! is just 5 × 4!

```c
#include <stdio.h>

int factorial(int n) {
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int main(void) {
    printf("%d\n", factorial(5));
    return 0;
}
```

Output

```text
120
```

factorial(5) waits for factorial(4), which waits for factorial(3), down to factorial(1), which returns 1. Then the answers come back up: 1, 2, 6, 24, 120

---

Where do all these waiting calls live? On the stack. Every call gets its own small box there, a stack frame, with its own copy of n. factorial(5) and factorial(4) each have their own n, and they don't mix

When a call returns, its frame is thrown away. If the base case is missing, frames pile up until the stack is full and the program crashes with a stack overflow. On Linux, we see it as "Segmentation fault"

---

The order of the lines matters. Code before the recursive call runs on the way down. Code after it runs on the way back up

```c
#include <stdio.h>

void digits(int n) {
    if (n < 10) {
        printf("%d\n", n);
        return;
    }
    digits(n / 10);
    printf("%d\n", n % 10);
}

int main(void) {
    digits(472);
    return 0;
}
```

Output

```text
4
7
2
```

n % 10 is the last digit, and n / 10 is everything before it. Because we print after the call, the first digits come out first. Move the printf above the call and the digits come out backwards

---

## Mission: The Lamp Panel

The front of the old mainframe has a row of lamps. A lamp that is on means 1, a lamp that is off means 0, so the panel shows numbers in binary. The technicians want a program that tells them which lamps a number lights up

To get the binary digits of n, divide it by 2 again and again. n % 2 is the last binary digit, and n / 2 holds all the digits before it. That's the same idea as the digits example, with 2 instead of 10

1. Write a recursive function **void print_binary(int n)** that prints n in binary, with no spaces and no new line
2. Write a recursive function **int count_ones(int n)** that returns how many 1s n has in binary
3. Read a whole number n from input and print the two results, as in the example
4. Use recursion, not loops: there are no for, while or do-while loops in this program

n is from 0 to 1000000. The number 0 is just "0" in binary

**Example**

Input

```text
13
```

Output

```text
Binary: 1101
Ones: 3
```

**Example**

Input

```text
0
```

Output

```text
Binary: 0
Ones: 0
```
