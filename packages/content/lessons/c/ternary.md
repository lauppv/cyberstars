Often an if/else only picks one of two values

```c
#include <stdio.h>

int main(void) {
    int temp = 35;
    int fan;
    if (temp > 30) {
        fan = 1;
    } else {
        fan = 0;
    }
    printf("Fan: %d\n", fan);
    return 0;
}
```

Seven lines to choose between 1 and 0. C has a shorter way: the **ternary operator**

---

```c
#include <stdio.h>

int main(void) {
    int temp = 35;
    int fan = temp > 30 ? 1 : 0;
    printf("Fan: %d\n", fan);
    return 0;
}
```

Output

```text
Fan: 1
```

Read `temp > 30 ? 1 : 0` like a question: "is temp over 30? If yes, 1. If not, 0". It has three parts, the condition, the value for yes and the value for no, so it's called ternary, from the Latin word for "three"

```text
condition ? value_if_true : value_if_false
```

---

The ternary operator gives back a value, so we can use it anywhere a value fits. Even inside printf, and even with strings

```c
#include <stdio.h>

int main(void) {
    int errors = 1;
    printf("%d %s found\n", errors, errors == 1 ? "error" : "errors");

    errors = 4;
    printf("%d %s found\n", errors, errors == 1 ? "error" : "errors");
    return 0;
}
```

Output

```text
1 error found
4 errors found
```

One word, chosen right where we print it. With if/else, we would need two whole printf lines

---

The bigger of two numbers fits on one line too

```c
#include <stdio.h>

int main(void) {
    int a = 12;
    int b = 40;
    int biggest = a > b ? a : b;
    printf("%d\n", biggest);
    return 0;
}
```

Output

```text
40
```

---

Use the ternary operator for a short choice between two values. When each side needs to do several things, or when there are three or more cases, an if/else is easier to read. We can put a ternary inside another one, but after two levels nobody can follow it, not even us a week later

---

## Mission: The Tape Room Report

Every hour, the tape room sends a short report to the shift chief. It says how many tape reels are loaded and if the room is too hot for the machines

1. Read two whole numbers from input: the number of reels, then the temperature in degrees
2. Print the first line with the number of reels. Write "reel" for exactly 1 reel and "reels" for any other number, 0 included
3. Print the second line: "Room: hot" when the temperature is over 30, "Room: OK" otherwise
4. Choose both words with the ternary operator. Don't use if or switch in this program

**Example**

Input

```text
3 34
```

Output

```text
3 reels loaded
Room: hot
```

**Example**

Input

```text
1 30
```

Output

```text
1 reel loaded
Room: OK
```
