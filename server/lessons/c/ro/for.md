Bun venit la unul dintre **cele mai importante** concepte din programare — bucla **for**. Cu ea, putem cere calculatorului să facă ceva **de multe ori, automat**

Imaginează-ți că vrem să afișăm toate numerele de la **1** la **10**

```c
#include <stdio.h>

int main(void) {
    printf("%d\n", 1);
    printf("%d\n", 2);
    printf("%d\n", 3);
    // ... si tot asa, de zece ori
    return 0;
}
```

Obositor. Pentru **1** la **1000** este imposibil. **for** ne salvează

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

Rulează-l. Vei vedea numerele de la **1** la **10**, câte unul pe linie

---

Bucla **for** din C are **trei părți** între paranteze, separate prin **;**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; i++) {
        printf("%d\n", i);
    }
    return 0;
}
```

1. **int i = 1** — **punctul de pornire**. Declarăm o variabilă **i** și o setăm la **1**
2. **i <= 10** — **condiția**. Atât timp cât aceasta este **adevărată**, bucla continuă să ruleze
3. **i++** — ce să facă **după fiecare iterație**. Creștem **i** cu 1

Așadar **i** ia valorile **1, 2, 3, ..., 10**. Când **i** devine **11**, condiția **11 <= 10** este **falsă** și bucla se termină

Un mic detaliu: în **C-ul mai vechi** (înainte de C99), nu puteai declara **int i** în interiorul lui **for**. Trebuia să-l declari înainte. În **C-ul modern** (C99 și mai recent, pe care îl folosim), declararea înăuntru este în regulă și idiomatic

Putem număra din 2 în 2, putem număra descrescător, putem face orice vrem

```c
#include <stdio.h>

int main(void) {
    // numarand din 2 in 2
    for (int i = 0; i <= 10; i = i + 2) {
        printf("%d\n", i);
    }

    // numarand descrescator
    for (int i = 10; i >= 1; i--) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i--** înseamnă **i = i - 1**

---

Fii atent — dacă uităm să actualizăm **i**, obținem o **buclă infinită**

```c
#include <stdio.h>

int main(void) {
    for (int i = 1; i <= 10; ) {
        printf("%d\n", i);
    }
    return 0;
}
```

**i** rămâne **1** pentru totdeauna, condiția rămâne **adevărată** pentru totdeauna, iar programul afișează **1** până când ceva îl oprește. Platforma îl oprește după 5 secunde, dar în sisteme reale o buclă infinită îți poate bloca calculatorul. Asigură-te mereu că condiția ta poate deveni falsă

---

## Misiune: Bobinele de bandă magnetică

Depozitul centrului de calcul are 101 bobine de bandă magnetică, numerotate de la **0** la **100**, așezate pe un raft lung. Majoritatea bobinelor afișează doar numărul lor pe etichetă, dar bobinele **10** și **50** au o etichetă specială: conțin rezerva de **cafea** a operatorilor de tură, nu date.

Scrie o buclă **for** de la 0 la 100. Pentru fiecare număr, dacă este **10** sau **50**, afișează `CAFEA` în loc de număr. Altfel afișează numărul în sine.

**Exemplu**

Programul tău ar trebui să afișeze

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
CAFEA
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
CAFEA
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
