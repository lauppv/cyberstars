Text and numbers are not the same thing. The string "42" is three chars: '4', '2' and '\0'. To add it to something, we first have to turn it into the int 42. When we read a whole line with fgets, or split it with strtok, we get text, so we need this often

---

The quickest way is **atoi**, from stdlib.h: "ASCII to integer"

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char text[] = "42";
    int n = atoi(text);
    printf("%d\n", n + 8);
    printf("%d\n", atoi("hello"));
    return 0;
}
```

Output

```text
50
0
```

atoi has a weak spot: when the text is not a number, it returns 0. And "0" also gives 0. So we can't tell a real zero from a mistake

---

**strtol** ("string to long") can tell. Besides the number, it tells us where it stopped reading, through a pointer we give it

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char good[] = "128";
    char bad[] = "12abc";
    char *end;

    long a = strtol(good, &end, 10);
    printf("%ld, rest: '%s'\n", a, end);

    long b = strtol(bad, &end, 10);
    printf("%ld, rest: '%s'\n", b, end);
    return 0;
}
```

Output

```text
128, rest: ''
12, rest: 'abc'
```

The 10 says we count in base 10. After the call, end points to the first char it couldn't read. If that char is the `'\0'` at the end of the string, the whole text was a number. If not, something else was in it. It returns a long, so we print it with **%ld**

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    char *texts[] = { "128", "12abc" };
    for (int i = 0; i < 2; i++) {
        char *end;
        long number = strtol(texts[i], &end, 10);
        if (*end == '\0') {
            printf("%s: the number %ld\n", texts[i], number);
        } else {
            printf("%s: not a number\n", texts[i]);
        }
    }
    return 0;
}
```

Output

```text
128: the number 128
12abc: not a number
```

One more check: an empty string has no digits at all, and end stays at its start, which is also the `'\0'`. So also check that the text is not empty

---

When a line has a fixed shape, like a word and then a number, **sscanf** reads it all at once. It works like scanf, but it reads from a string instead of from the input

```c
#include <stdio.h>

int main(void) {
    char line[] = "tape 7";
    char name[32];
    int number;

    int found = sscanf(line, "%31s %d", name, &number);
    printf("%d values: %s and %d\n", found, name, number);
    return 0;
}
```

Output

```text
2 values: tape and 7
```

The `%31s` reads a word of at most 31 chars, so it fits in name[32] with its '\0'. And just like scanf, sscanf returns how many values it read. For "tape seven", %s reads the word, %d finds no digits, and it returns 1. That return value is our check

---

## Mission: The Job Cards

Each job for the mainframe arrives on a card with two things on it: the job's name and how many minutes it needs, like "compile 12". Some cards were punched badly: the minutes are missing, or written in letters. The scheduler must skip those cards and say which ones they were

1. Read cards, one per line, until the input ends
2. Read each card with sscanf. A good card gives you both a name and a whole number of minutes
3. For each bad card, print it as in the example
4. At the end, print how many good jobs there were and the sum of their minutes

There are no empty lines. A name is one word of at most 20 letters, and a card has at most 50 characters

**Example**

Input

```text
compile 12
print twelve
sort 30
backup
```

Output

```text
Bad card: print twelve
Bad card: backup
Jobs: 2
Minutes: 42
```
