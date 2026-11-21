Every C programmer, on every day of their life, writes code that doesn't compile. That's normal. What makes the difference is how fast we understand what gcc is telling us. Its messages look scary at first, but they all follow the same shape

---

```c
#include <stdio.h>

int main(void) {
    int count = 3
    printf("%d\n", count);
    return 0;
}
```

gcc answers

```text
program.c: In function 'main':
program.c:5:5: error: expected ',' or ';' before 'printf'
    5 |     printf("%d\n", count);
      |     ^~~~~~
```

Read it in pieces

- `program.c:5:5` is the file, the **line** and the **column** where gcc noticed the problem
- `error:` means the program can't be built. A `warning:` would still build, but something looks wrong
- the rest says what gcc expected and didn't find
- below, gcc shows the line and puts `^` under the exact place

Notice something: the missing `;` is at the end of line 4, but gcc complains about line 5. gcc only knows something is missing when it sees the next thing, printf, where a `;` should have been. So when an error makes no sense on its line, look at the line **before** it

---

```c
#include <stdio.h>

int main(void) {
    int total = 10;
    printf("%d\n", totl);
    return 0;
}
```

```text
program.c:5:20: error: 'totl' undeclared (first use in this function); did you mean 'total'?
```

**undeclared** means gcc has never heard of that name. Most often it's a typo, or a variable used outside its scope. gcc even guesses what we meant

---

```c
#include <stdio.h>

int main(void) {
    char name[] = "Ada";
    printf("%d\n", (int)strlen(name));
    return 0;
}
```

```text
program.c:5:25: error: implicit declaration of function 'strlen' [-Wimplicit-function-declaration]
program.c:2:1: note: include '<string.h>' or provide a declaration of 'strlen'
```

**implicit declaration** means we called a function gcc doesn't know. Either the name is wrong, or we forgot the #include that brings it in. A `note:` line under an error gives extra help, and here it tells us exactly which include is missing

---

```c
#include <stdio.h>

int square(int x) {
    return x * x;
}

int main(void) {
    printf("%d\n", square(2, 3));
    return 0;
```

```text
program.c:8:20: error: too many arguments to function 'square'; expected 1, have 2
program.c:9:5: error: expected declaration or statement at end of input
```

Two errors here. The first one is clear: square takes 1 value and we gave it 2. The second one is about the missing `}` at the end of main. gcc reads to the end of the file, still waiting for it. When you see **at end of input**, count your braces

---

Sometimes the code compiles, and then a different tool complains

```text
undefined reference to `sqare'
ld returned 1 exit status
```

`ld` is the **linker**, the tool that joins our code with the library code after gcc is done. "Undefined reference" means some code calls a function that nobody ever wrote, usually because the name is spelled differently in two places

---

The most important rule: **fix the first error first**. One mistake can confuse gcc so much that it reports five more errors after it, errors that disappear on their own once the first one is fixed. So read the first message, fix it, compile again, and repeat

---

## Mission: The Broken Shift Report

A trainee wrote a program for the shift report and went home. It doesn't compile. The program reads an operator's name and their shift hours, and should print a short report. Copy it into the editor exactly as it is, press Run, and fix it by reading what gcc says. Fix the first error first

```c
#include <stdio.h>

int longest(int v[], int n) {
    int best = v[0]
    for (int i = 1; i < n; i++) {
        if (v[i] > best) {
            best = v[i];
        }
    }
    return best;
}

int main(void) {
    char name[32];
    int n;
    int hours[50];
    int total = 0;
    scanf("%31s %d", name, &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &hours[i]);
        total = totl + hours[i];

    printf("%s (%d letters)\n", name, (int)strlen(name));
    printf("Shifts: %d\n", n);
    printf("Hours: %d\n", total);
    printf("Longest shift: %d\n", longest(hours, n, total));
    return 0;
}
```

There are five mistakes, but gcc shows more than five errors the first time. The input is a name, then the number of shifts n, then the n shifts in hours. n is from 1 to 50

**Example**

Input

```text
ada 3
8 12 6
```

Output

```text
ada (3 letters)
Shifts: 3
Hours: 26
Longest shift: 12
```
