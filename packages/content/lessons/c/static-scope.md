Every variable has a **scope**: the part of the code where it can be seen. So far, most of our variables lived inside a function

```c
#include <stdio.h>

void visit(void) {
    int count = 0;
    count++;
    printf("count is %d\n", count);
}

int main(void) {
    visit();
    visit();
    visit();
    return 0;
}
```

Output

```text
count is 1
count is 1
count is 1
```

count is a **local** variable. It's made fresh every time visit starts, and thrown away when visit ends. Three calls, three different counts, each going from 0 to 1. main can't even see it: writing count in main would not compile

---

A block between `{` and `}` has its own scope too. A variable made inside an if or a for is gone after the closing brace

```c
#include <stdio.h>

int main(void) {
    for (int i = 0; i < 3; i++) {
        int twice = i * 2;
        printf("%d\n", twice);
    }
    // i and twice don't exist here
    return 0;
}
```

Output

```text
0
2
4
```

---

A variable written outside every function is **global**. Every function in the file can see it and change it

```c
#include <stdio.h>

int visits = 0;

void visit(void) {
    visits++;
}

int main(void) {
    visit();
    visit();
    printf("%d visits\n", visits);
    return 0;
}
```

Output

```text
2 visits
```

It works, but any function can change a global, by mistake too. In a big program, when a global has a strange value, we have to search everywhere to find who changed it. Use them rarely

---

There is a middle way. A local variable marked **static** is seen only inside its function, like a local. But it is made only once, and it keeps its value between calls, like a global

```c
#include <stdio.h>

int next_id(void) {
    static int last = 100;
    last++;
    return last;
}

int main(void) {
    printf("%d\n", next_id());
    printf("%d\n", next_id());
    printf("%d\n", next_id());
    return 0;
}
```

Output

```text
101
102
103
```

The line `static int last = 100;` runs only once, before the first call. After that, last remembers where it stopped. And no other function can touch it, so only next_id decides the numbers

---

One more thing about names: a variable inside a block can have the same name as one outside. The inner one hides the outer one until the block ends

```c
#include <stdio.h>

int main(void) {
    int x = 1;
    {
        int x = 2;
        printf("%d\n", x);
    }
    printf("%d\n", x);
    return 0;
}
```

Output

```text
2
1
```

This is legal, but it's easy to get confused. Give different things different names

---

## Mission: The Two Windows

The computing center has two windows. At window R you hand in a job to run, at window P you pick up a printout. Every visitor takes a ticket for one window, and each window numbers its own tickets: R1, R2, R3 and P1, P2, P3

1. Write a function **int take_ticket(char window)** that returns the next ticket number for that window, 'R' or 'P'. Keep the two counts in static variables inside the function
2. Read one word from input: the windows the visitors chose, in order, like RPRRP
3. For each letter, print the window and the ticket number it gets, one per line

The word has from 1 to 50 letters, each R or P

**Example**

Input

```text
RPRRP
```

Output

```text
R1
P1
R2
R3
P2
```
