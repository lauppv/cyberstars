Un arbore are o regulă care îl ține în ordine: de la rădăcină până la fiecare nod există exact un drum. Renunță la regula asta. Lasă orice nod să se lege de oricare altul, lasă legăturile să se închidă în cerc și nu mai alege nicio rădăcină. Ce obții este un **graf**, și așa vede un program o hartă, un grup de prieteni sau sarcinile unui proiect

---

Un graf e făcut din **noduri**, punctele, și **muchii**, legăturile dintre câte două dintre ele. Două noduri unite de o muchie sunt **vecini**

```visual
{"use": "graph-parts"}
```

Graful acesta are **5** noduri, numerotate de la **0** la **4**, și **5** muchii: 0-1, 0-2, 1-2, 1-3 și 3-4. Nodul **1** are trei vecini, **0**, **2** și **3**. Nodul **4** are unul singur, **3**

Spre deosebire de un arbore, un graf se poate închide în cerc: de la **0** la **1**, la **2** și înapoi la **0**. Asta e un **ciclu**

---

Muchiile de mai sus merg în ambele sensuri, ca o stradă cu dublu sens: dacă **0** e unit cu **1**, atunci și **1** e unit cu **0**. Acesta e un graf **neorientat**

Unele legături merg doar într-un sens, ca o stradă cu sens unic, sau ca atunci când urmărești pe cineva online care nu te urmărește înapoi. Atunci muchiile au săgeți, iar graful este **orientat**

```visual
{"use": "graph-directed"}
```

Aici poți merge de la **0** la **1**, dar nu direct înapoi de la **1** la **0**. Fiecare muchie se scrie de unde pleacă până unde ajunge: 0-1, 1-2, 2-3, 3-0

---

Un program nu poate citi un desen, așa că fiecare graf din cursul acesta vine în aceeași formă: pe prima linie numărul de noduri **n** și numărul de muchii **m**, apoi câte o muchie pe linie, cele două noduri pe care le unește

```text
5 5
0 1
0 2
1 2
1 3
3 4
```

Acesta e graful din primul desen. Nodurile sunt numerotate mereu de la **0** la **n - 1**, așa că numărul unui nod poate fi folosit direct ca index

**scanf** cu **%d** sare peste spațiile și liniile noi dinaintea unui număr, așa că toată intrarea se citește câte un număr pe rând

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    printf("noduri: %d\n", n);
    printf("muchii: %d\n", m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        printf("muchie de la %d la %d\n", u, v);
    }
    return 0;
}
```

Pentru intrarea de mai sus, rezultatul este

```text
noduri: 5
muchii: 5
muchie de la 0 la 1
muchie de la 0 la 2
muchie de la 1 la 2
muchie de la 1 la 3
muchie de la 3 la 4
```

---

Să citești muchiile e un lucru. Ca să lucrezi cu graful, trebuie să le păstrezi, ca să poți întreba „sunt **1** și **3** unite?” sau „cine sunt vecinii lui **1**?”. Există două moduri obișnuite

Primul este o **matrice de adiacență**: un tabel cu câte un rând și câte o coloană pentru fiecare nod. Celula de pe rândul **u**, coloana **v**, are **1** dacă **u** și **v** sunt unite și **0** dacă nu sunt

```visual
{"use": "graph-matrix"}
```

Într-un graf neorientat fiecare muchie umple două celule, **[u][v]** și **[v][u]**, așa că tabelul arată la fel de o parte și de alta a diagonalei

C nu are un tabel care să crească după nevoie, așa că fă-l cât cel mai mare graf la care te aștepți. Grafurile din lecțiile acestea au cel mult **8** noduri, deci `int matrice[8][8]` ajunge, iar `= {0}` pornește fiecare celulă de la zero. Se folosesc doar primele **n** rânduri și coloane

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int matrice[8][8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        matrice[u][v] = 1;
        matrice[v][u] = 1;
    }

    for (int u = 0; u < n; u++) {
        for (int v = 0; v < n; v++) {
            printf("%d ", matrice[u][v]);
        }
        printf("\n");
    }

    printf("%d\n", matrice[1][3]);
    printf("%d\n", matrice[2][4]);
    return 0;
}
```

Pentru intrarea de mai sus, rezultatul este

```text
0 1 1 0 0
1 0 1 1 0
1 1 0 0 0
0 1 0 0 1
0 0 0 1 0
1
0
```

Matricea răspunde la „sunt unite?” dintr-un pas. Dar ocupă **n × n** celule chiar și când sunt puține muchii, iar ca să găsești vecinii unui nod trebuie să treci prin tot rândul lui

---

Al doilea mod este o **listă de adiacență**: pentru fiecare nod, lista vecinilor lui

```visual
{"use": "graph-list"}
```

C nu are o listă care să crească, așa că o construiești din array-uri: rândul **v** din `vecini` ține vecinii lui **v**, iar `numar[v]` spune câți sunt până acum. Un nod are cel mult **n - 1** vecini, deci un rând de **8** ajunge. Ca să-l adaugi pe **x** în lista lui **v**, îl scrii la capătul rândului și muți capătul mai departe

```text
vecini[v][numar[v]] = x;
numar[v]++;
```

Fiecare muchie **u v** îl adaugă pe **v** în lista lui **u** și, pentru că graful e neorientat, pe **u** în lista lui **v**

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int vecini[8][8];
    int numar[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }

    for (int v = 0; v < n; v++) {
        printf("%d:", v);
        for (int i = 0; i < numar[v]; i++) {
            printf(" %d", vecini[v][i]);
        }
        printf("\n");
    }

    printf("vecinii lui 1: %d\n", numar[1]);
    return 0;
}
```

Pentru intrarea de mai sus, rezultatul este

```text
0: 1 2
1: 0 2 3
2: 0 1
3: 1 4
4: 3
vecinii lui 1: 3
```

Doar primele **numar[v]** locuri dintr-un rând țin vecini, așa că **vecini** nu are nevoie de zerouri: buclele nu citesc niciodată mai departe de numărătoare

Lista păstrează doar muchiile care există, iar vecinii unui nod sunt chiar acolo, în ordinea în care le-au fost citite muchiile. De asta au nevoie cele mai multe parcurgeri de grafuri, așa că lecțiile următoare o folosesc cel mai des

---

Într-un graf orientat, o muchie **u v** merge doar de la **u** la **v**: umple doar **matrice[u][v]** și îl adaugă pe **v** în lista lui **u**, fără să pună nimic în lista lui **v**

```visual
{"use": "graph-directed-store"}
```

Acesta e graful cu săgeți de mai devreme

---

## Misiune: Desenează rețeaua

1. Citește un graf neorientat cu **scanf**: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie
2. Păstrează-l în două feluri: o matrice de adiacență și o listă de adiacență
3. Afișează **Matrice:**, apoi matricea, câte un rând pe linie, cu valorile separate prin spații
4. Afișează **Lista:**, apoi câte o linie pentru fiecare nod, de la **0** la **n - 1**: nodul, două puncte și vecinii lui, în ordinea în care le-au fost citite muchiile

**n** este de la 1 la 8, iar nodurile sunt numerotate de la 0 la **n - 1**. Nicio muchie nu unește un nod cu el însuși și nicio muchie nu apare de două ori. **m** poate fi 0

**Exemplu**

Intrare

```text
5 5
0 1
0 2
1 2
1 3
3 4
```

Ieșire

```text
Matrice:
0 1 1 0 0
1 0 1 1 0
1 1 0 0 0
0 1 0 0 1
0 0 0 1 0
Lista:
0: 1 2
1: 0 2 3
2: 0 1
3: 1 4
4: 3
```

**Exemplu**

Intrare

```text
4 3
2 0
3 1
1 2
```

Ieșire

```text
Matrice:
0 0 1 0
0 0 1 1
1 1 0 0
0 1 0 0
Lista:
0: 2
1: 3 2
2: 0 1
3: 1
```
