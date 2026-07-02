Welcome to one of the **most important** concepts in programming — the **for** loop. With it, we can tell the computer to do something **many times, automatically**

Imagine we want to print all the numbers from **1** to **10**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 1);
    printf("%d\n", 2);
    printf("%d\n", 3);
    // ... and so on, ten times
    return 0;
}
```

Tedious. For **1** to **1000** it's impossible. **for** saves us

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

Run it. You'll see the numbers from **1** to **10**, one per line

---

The **for** loop in C has **three parts** between the parentheses, separated by **;**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

1. **int i = 1** — the **starting point**. We declare a variable **i** and set it to **1**
2. **i <= 10** — the **condition**. As long as this is **true**, the loop keeps running
3. **i++** — what to do **after each iteration**. We increase **i** by 1

So **i** takes the values **1, 2, 3, ..., 10**. When **i** becomes **11**, the condition **11 <= 10** is **false** and the loop ends

A small detail: in **older C** (before C99), you couldn't declare **int i** inside **for**. You had to declare it beforehand. In **modern C** (C99 and later, which we use), declaring it inside is fine and idiomatic

We can count by 2s, count down, do anything we want

```c
#include <stdio.h>

int main(void) {
    // counting by 2s
    for (int i = 0; i <= 10; i = i + 2) {
        printf("%d\n", i);
    }

    // counting down
    for (int i = 10; i >= 1; i--) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i--** means **i = i - 1**

---

Be careful — if we forget to update **i**, we get an **infinite loop**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; ) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i** stays **1** forever, the condition stays **true** forever, and the program prints **1** until something stops it. The platform stops it after 5 seconds, but on real systems an infinite loop can freeze your computer. Always make sure your condition can become false

---

## Mission: The Magnetic Tape Reels

The computing center's storage room has 101 magnetic tape reels, numbered from **0** to **100**, sitting on a long shelf. Most reels just show their number on the label, but reels **10** and **50** have a special label: they hold the shift operators' **coffee** stash, not data.

Write a **for** loop from 0 to 100. For each number, if it is **10** or **50**, print `COFFEE` instead of the number. Otherwise print the number itself.

**Example**

Your program should print

```text
0
1
2
3
4
5
6
7
8
9
COFFEE
11
12
13
14
15
16
17
18
19
20
21
22
23
24
25
26
27
28
29
30
31
32
33
34
35
36
37
38
39
40
41
42
43
44
45
46
47
48
49
COFFEE
51
52
53
54
55
56
57
58
59
60
61
62
63
64
65
66
67
68
69
70
71
72
73
74
75
76
77
78
79
80
81
82
83
84
85
86
87
88
89
90
91
92
93
94
95
96
97
98
99
100
```
