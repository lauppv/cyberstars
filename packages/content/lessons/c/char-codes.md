Inside the computer, a char is a small number. Each letter, digit and sign has its own code, from a table called **ASCII**. When we write `'A'`, C reads it as the number 65

```c
#include <stdio.h>

int main(void) {
    char c = 'A';
    printf("%c\n", c);
    printf("%d\n", c);
    return 0;
}
```

Output

```text
A
65
```

Same value, two ways to print it. **%c** shows the character, **%d** shows its code

---

A few codes worth knowing

```text
'0' .. '9'   48 .. 57
'A' .. 'Z'   65 .. 90
'a' .. 'z'   97 .. 122
' '          32
```

The letters come in order, and so do the digits. That's what makes the next tricks work. We don't need to learn the numbers by heart: C does the math for us when we write the characters themselves

---

Since a char is a number, we can add to it. The letter after `'A'` is `'A' + 1`

```c
#include <stdio.h>

int main(void) {
    for (char c = 'A'; c <= 'E'; c++) {
        printf("%c", c);
    }
    printf("\n");
    return 0;
}
```

Output

```text
ABCDE
```

---

Small and capital letters are always the same distance apart: `'a' - 'A'` is 32. To turn a small letter into a capital, we take the distance away

```c
#include <stdio.h>

int main(void) {
    char c = 'g';
    char big = c - ('a' - 'A');
    printf("%c\n", big);
    return 0;
}
```

Output

```text
G
```

But only for small letters. A space or a digit would turn into something strange. So first we check that c is between `'a'` and `'z'`

```c
#include <stdio.h>

int main(void) {
    char c = '7';
    if (c >= 'a' && c <= 'z') {
        c = c - ('a' - 'A');
    }
    printf("%c\n", c);
    return 0;
}
```

Output

```text
7
```

---

A digit character is not the number it shows. `'7'` is the code 55, not 7. To get the number, we take away the code of `'0'`

```c
#include <stdio.h>

int main(void) {
    char d = '7';
    int value = d - '0';
    printf("%d\n", value * 2);
    return 0;
}
```

Output

```text
14
```

`'7' - '0'` is 55 - 48, which is 7. This works for every digit, because the digits sit side by side in the table

---

Put it together and we can walk through a string, one char at a time, until the `'\0'` at its end

```c
#include <stdio.h>

int main(void) {
    char word[] = "Unix 1969";
    int digits = 0;
    for (int i = 0; word[i] != '\0'; i++) {
        if (word[i] >= '0' && word[i] <= '9') {
            digits++;
        }
    }
    printf("%d digits\n", digits);
    return 0;
}
```

Output

```text
4 digits
```

---

## Mission: The Loud Teletype

The old teletype in the corner can only print capital letters. Before a message goes to it, a program must turn every small letter into a capital. The operator also wants a quick check of the numbers in the message: the sum of all its digits

1. Read one line of text with fgets. It may have spaces, digits and signs
2. Print the line again, with every small letter from a to z turned into a capital. Everything else stays as it is
3. Print the sum of all the digits in the line, as in the example. A line with no digits has the sum 0
4. Do the math with the character codes yourself, without toupper or the other ctype.h functions

The line has at most 100 characters

**Example**

Input

```text
tape 42 on drive 7
```

Output

```text
TAPE 42 ON DRIVE 7
Digit sum: 13
```

**Example**

Input

```text
Hello, Bell Labs!
```

Output

```text
HELLO, BELL LABS!
Digit sum: 0
```
