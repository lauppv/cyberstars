A while loop checks its condition first. If the condition is false from the start, the body never runs, not even once

Sometimes we want the opposite: do the work first, then decide if we go again. For that, C has **do-while**

```c
#include <stdio.h>

int main(void) {
    int i = 1;
    do {
        printf("Round %d\n", i);
        i++;
    } while (i <= 3);
    return 0;
}
```

Output

```text
Round 1
Round 2
Round 3
```

The body sits between `do {` and `}`. The condition comes after it, in `while (...)`. Don't forget the `;` at the very end: a do-while is the only loop in C that needs one

---

The difference shows when the condition is false right away

```c
#include <stdio.h>

int main(void) {
    int n = 10;

    while (n < 5) {
        printf("while: %d\n", n);
    }

    do {
        printf("do-while: %d\n", n);
    } while (n < 5);

    return 0;
}
```

Output

```text
do-while: 10
```

The while loop asks first, gets "no", and skips its body. The do-while runs its body once, then asks, gets "no", and stops. A do-while always runs **at least once**

---

Where is this useful? When the value we check only exists after the first round. Reading input is the classic case: we can't check a number before we read it

```c
#include <stdio.h>

int main(void) {
    int code;
    do {
        scanf("%d", &code);
        printf("Got %d\n", code);
    } while (code != 0);
    printf("Reader stopped\n");
    return 0;
}
```

Input

```text
7 3 0
```

Output

```text
Got 7
Got 3
Got 0
Reader stopped
```

With a plain while, we would need one scanf before the loop and another one inside it. The do-while needs only one

---

## Mission: The Card Counter

The card reader in the computing center reads punch cards one by one. Each card has a number of holes on it. The operator puts a blank card with 0 holes at the end of the stack, so the reader knows when to stop. The blank card is a card too, so it counts

1. Read whole numbers from input with a do-while loop: the holes on each card. Stop after you read the 0
2. Count the cards, the blank one included, and add up all the holes
3. Print the two results, as in the example

The stack always ends with a 0, and has from 1 to 100 cards

**Example**

Input

```text
12 5 30 0
```

Output

```text
Cards: 4
Holes: 47
```

**Example**

Input

```text
0
```

Output

```text
Cards: 1
Holes: 0
```
