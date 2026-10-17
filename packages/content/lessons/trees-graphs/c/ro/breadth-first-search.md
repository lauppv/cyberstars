La câte strângeri de mână de tine e un necunoscut? Câte stații sunt între două stații de metrou? Din cât de puține mutări ieși dintr-un labirint? De fiecare dată e aceeași întrebare despre un graf: **cele mai puține muchii** de la un nod la altul. Parcurgerea care îi răspunde o știi deja de la arbori

---

Parcurgerea pe niveluri lua rădăcina, apoi tot ce era cu un pas sub ea, apoi tot ce era cu doi pași sub ea. Într-un graf nu există rădăcină, dar poți alege orice nod de pornire și să mergi în afară de la el la fel: întâi vecinii lui, apoi vecinii lor, și tot așa. Asta este o **parcurgere în lățime**, sau **BFS** (din engleză, breadth-first search)

```text
    0 ----- 1 ----- 4
    |       |       |
    |       |       |
    2 ----- 3       5 ----- 6
```

Pornind de la **0**, nodurile vin în inele în jurul lui

```text
0 pasi    0
1 pas     1 2
2 pasi    3 4
3 pasi    5
4 pasi    6
```

Inelul în care e un nod este **distanța** lui de la start: cele mai puține muchii pe care trebuie să le treci ca să ajungi la el. **3** e la doi pași de **0**, prin **1** sau prin **2**, pe oricare drum ai merge

---

Parcurgerea din arbori mai are nevoie de un lucru ca să meargă pe un graf. Un arbore nu are cicluri, așa că fiecare nod e atins o singură dată. Într-un graf, **3** e vecin și cu **1**, și cu **2**, iar **0** e vecin cu **1**, propriul lui vecin. Pune fiecare vecin în coadă și parcurgerea vizitează nodurile iar și iar, iar într-un ciclu nu se mai oprește

Așa că ține un array **dist**, câte un număr pentru fiecare nod, toate **-1** la început, adică „încă nevăzut”. Când un nod e văzut prima dată, scrie acolo distanța lui și pune-l în coadă. Un nod a cărui distanță nu mai e **-1** nu mai intră niciodată în coadă

---

Coada e cea din lecția despre parcurgerea pe niveluri, un array cu **inceput** și **sfarsit**. Fiecare nod intră în ea cel mult o dată, deci are nevoie de câte un loc pentru fiecare nod. Ia nodul din fața cozii. Fiecare vecin încă nevăzut e cu un pas mai departe de start decât el. Iată graful de mai sus, în intrarea obișnuită

```text
7 7
0 1
0 2
1 3
2 3
1 4
4 5
5 6
```

și parcurgerea de la **0**

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

    int start = 0;
    int dist[8];
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[start] = 0;
    int coada[8];
    int inceput = 0;
    int sfarsit = 0;
    coada[sfarsit] = start;
    sfarsit++;
    while (inceput < sfarsit) {
        int u = coada[inceput];
        inceput++;
        printf("vizitez %d la distanta %d\n", u, dist[u]);
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            if (dist[v] == -1) {
                dist[v] = dist[u] + 1;
                coada[sfarsit] = v;
                sfarsit++;
            }
        }
    }
    return 0;
}
```

Rezultat

```text
vizitez 0 la distanta 0
vizitez 1 la distanta 1
vizitez 2 la distanta 1
vizitez 3 la distanta 2
vizitez 4 la distanta 2
vizitez 5 la distanta 3
vizitez 6 la distanta 4
```

Iată coada după ce fiecare nod e scos și vecinii lui noi sunt puși

```text
scot   vecini noi   coada dupa
                    [0]
0      1 2          [1, 2]
1      3 4          [2, 3, 4]
2                   [3, 4]
3                   [4]
4      5            [5]
5      6            [6]
6                   []
```

Când e scos **2**, vecinii lui **0** și **3** sunt deja văzuți, așa că nu intră nimeni. Coada ține cel mult două distanțe deodată, inelul care se scoate și următorul, așa că nodurile ies din ea inel cu inel

---

Un nod e marcat în clipa în care intră în coadă, nu când iese. Dacă l-ai marca doar la ieșire, **3** ar intra de două ori, o dată de la **1** și o dată de la **2**, pentru că niciunul n-ar ști că celălalt l-a găsit deja

Iar distanța e corectă de prima dată când e scrisă. Fiecare nod dintr-un inel iese din coadă înaintea oricărui nod din inelul următor, așa că prima dată când e găsit **v**, e găsit dintr-un nod cât se poate de aproape de start

---

Cei mai puțini pași de la start până la orice nod **t** sunt acum **dist[t]**. Un nod la care parcurgerea n-a ajuns niciodată își păstrează **-1**: nu există niciun drum până la el, lucru care se poate întâmpla când graful vine în bucăți separate

```text
    0 ----- 1       2 ----- 3
```

De la **0**, distanțele sunt **0 1 -1 -1**

---

Un graf nu vine mereu ca o listă de muchii. Și un labirint e un graf: fiecare celulă liberă e un nod, iar două celule libere alăturate, sus, jos, stânga sau dreapta, sunt unite de o muchie. O grilă îl dă ca rânduri de text, **.** pentru o celulă liberă și **#** pentru un zid, după o linie cu numărul de rânduri și de coloane

```text
4 5
..#..
.#...
...#.
#....
```

O celulă e o pereche, rândul ei **r** și coloana ei **c**. Ca coada să rămână un array de numere simple, dă-i fiecărei celule un singur număr, **r \* coloane + c**: rând cu rând, de la stânga la dreapta. Împărțirea o transformă înapoi în pereche: rândul e numărul împărțit la **coloane**, cu **/**, iar coloana e restul, cu **%**. Vecinii ei nu sunt ținuți nicăieri: sunt cele patru celule de lângă ea, cele care sunt în grilă și libere

```c
#include <stdio.h>

int main(void) {
    int randuri, coloane;
    scanf("%d %d", &randuri, &coloane);
    char grila[10][11];
    for (int r = 0; r < randuri; r++) {
        scanf("%s", grila[r]);
    }

    int dist[10][10];
    for (int r = 0; r < randuri; r++) {
        for (int c = 0; c < coloane; c++) {
            dist[r][c] = -1;
        }
    }
    int dr[4] = {-1, 1, 0, 0};
    int dc[4] = {0, 0, -1, 1};
    int coada[100];
    int inceput = 0;
    int sfarsit = 0;
    dist[0][0] = 0;
    coada[sfarsit] = 0;
    sfarsit++;
    while (inceput < sfarsit) {
        int r = coada[inceput] / coloane;
        int c = coada[inceput] % coloane;
        inceput++;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k];
            int nc = c + dc[k];
            if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane) {
                if (grila[nr][nc] == '.' && dist[nr][nc] == -1) {
                    dist[nr][nc] = dist[r][c] + 1;
                    coada[sfarsit] = nr * coloane + nc;
                    sfarsit++;
                }
            }
        }
    }

    for (int r = 0; r < randuri; r++) {
        for (int c = 0; c < coloane; c++) {
            if (grila[r][c] == '#') {
                printf(" #");
            } else {
                printf("%2d", dist[r][c]);
            }
        }
        printf("\n");
    }
    printf("pasi pana la iesire: %d\n", dist[randuri - 1][coloane - 1]);
    return 0;
}
```

Pentru labirintul de mai sus, rezultatul este

```text
 0 1 # 7 8
 1 # 5 6 7
 2 3 4 # 8
 # 4 5 6 7
pasi pana la iesire: 7
```

**%2d** scrie un număr pe două poziții, ca să se alinieze coloanele. **scanf("%s")** citește un rând din grilă ca un singur cuvânt, până la următorul spațiu sau linie nouă. Parcurgerea e aceeași ca pe lista de muchii: s-a schimbat doar felul în care un nod își găsește vecinii

---

## Misiune: Numără pașii

1. Citește un graf neorientat cu **scanf**: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie, iar după ele o linie cu două noduri, **s** și **t**
2. Află distanța fiecărui nod de la **s** cu o parcurgere în lățime, folosind o coadă
3. Afișează câte o linie pentru fiecare nod, de la **0** la **n - 1**: nodul, două puncte și distanța lui de la **s**, sau **-1** dacă nu se poate ajunge la el
4. Afișează **Cei mai putini pasi de la**, **s**, **la**, **t**, două puncte și distanța, sau **Niciun drum de la**, **s**, **la** și **t** dacă nu se poate ajunge la **t**

**n** este de la 1 la 8, iar nodurile sunt numerotate de la 0 la **n - 1**. Nicio muchie nu unește un nod cu el însuși și nicio muchie nu apare de două ori. **s** și **t** pot fi același nod

**Exemplu**

Intrare

```text
7 7
0 1
0 2
1 3
2 3
1 4
4 5
5 6
0 6
```

Ieșire

```text
0: 0
1: 1
2: 1
3: 2
4: 2
5: 3
6: 4
Cei mai putini pasi de la 0 la 6: 4
```

**Exemplu**

Intrare

```text
5 3
0 1
1 2
3 4
2 4
```

Ieșire

```text
0: 2
1: 1
2: 0
3: -1
4: -1
Niciun drum de la 2 la 4
```
