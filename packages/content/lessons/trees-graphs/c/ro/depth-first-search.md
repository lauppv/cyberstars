Parcurgerea în lățime se întinde ca o undă, câte un inel pe rând. Există și alt fel de a explora: alegi un drum și îl urmezi cât de departe merge, iar abia când te blochezi, te întorci la ultimul loc unde ai avut de ales. Așa ai explora o peșteră, și asta este o **parcurgere în adâncime**, sau **DFS** (din engleză, depth-first search)

---

Ai parcurs deja un arbore așa: parcurgerea în preordine coboară până jos pe partea stângă înainte să se întoarcă după cea dreaptă. Pe un graf e aceeași parcurgere, cu semnele de **văzut** de care a avut nevoie și parcurgerea în lățime, pentru că un graf te poate duce înapoi la un nod pe care l-ai vizitat deja

```visual
{"use": "dfs-back"}
```

Iată cele **8** noduri și **6** muchii ale lui, în intrarea obișnuită

```text
8 6
0 1
0 2
1 3
2 4
3 4
5 6
```

---

Parcurgerea recursivă are câteva linii. Marchează nodul, apoi intră în adâncime în fiecare vecin încă nevăzut. Array-urile stau în afara lui **main**, așa că **dfs** ajunge la ele fără să le primească drept parametri, iar C pornește astfel de array-uri de la zero

```c
#include <stdio.h>

int vecini[8][8];
int numar[8];
int vazut[8];

void dfs(int u) {
    vazut[u] = 1;
    printf("vizitez %d\n", u);
    for (int i = 0; i < numar[u]; i++) {
        int v = vecini[u][i];
        if (!vazut[v]) {
            dfs(v);
        }
    }
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }

    dfs(0);
    return 0;
}
```

Rezultat

```text
vizitez 0
vizitez 1
vizitez 3
vizitez 4
vizitez 2
```

Fiecare apel rămâne deschis până se termină tot ce se poate atinge din nodul lui. Iată cât de adânc merg apelurile

```visual
{"use": "dfs-calls"}
```

**2** e vecin cu **0**, dar e vizitat ultimul: parcurgerea a ajuns la el pe drumul lung, prin **1**, **3** și **4**, înainte ca **0** să ajungă la el. Parcurgerea în lățime ar vizita **0 1 2 3 4**. Amândouă ating aceleași noduri, doar ordinea diferă

Iar **5**, **6** și **7** nu sunt vizitate niciodată: nicio muchie nu duce la ele de la **0**

---

Recursivitatea ține minte unde să se întoarcă: fiecare apel deschis e un loc unde mai e ceva de ales. Poți ține tu evidența asta cu o **stivă**, o grămadă în care ultimul lucru pus e primul luat, ca un teanc de farfurii

În C, o stivă e un array și un singur index, **varf**, numărul de elemente de pe ea. Ca să pui un element, îl scrii la **varf** și urci **varf**; ca să iei unul, cobori **varf** și îl citești de acolo

```c
#include <stdio.h>

int main(void) {
    int stiva[10];
    int varf = 0;

    stiva[varf] = 1;
    varf++;
    stiva[varf] = 2;
    varf++;
    stiva[varf] = 3;
    varf++;

    varf--;
    printf("%d\n", stiva[varf]);
    varf--;
    printf("%d\n", stiva[varf]);
    printf("%d\n", varf);
    return 0;
}
```

Rezultat

```text
3
2
1
```

Parcurgerea ia un nod de deasupra, îl vizitează dacă nu e încă văzut și îi pune vecinii pe stivă. Vecinul pus ultimul e cel luat următorul, așa că parcurgerea merge tot mai adânc. Dacă îi pui de la ultimul vecin la primul, primul vecin iese primul și obții aceeași ordine ca la recursivitate

```c
#include <stdio.h>

int vecini[8][8];
int numar[8];

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }

    int vazut[8] = {0};
    int stiva[64];
    int varf = 0;
    stiva[varf] = 0;
    varf++;
    while (varf > 0) {
        varf--;
        int u = stiva[varf];
        if (vazut[u]) {
            continue;
        }
        vazut[u] = 1;
        printf("vizitez %d\n", u);
        for (int i = numar[u] - 1; i >= 0; i--) {
            int v = vecini[u][i];
            if (!vazut[v]) {
                stiva[varf] = v;
                varf++;
            }
        }
    }
    return 0;
}
```

Rezultat

```text
vizitez 0
vizitez 1
vizitez 3
vizitez 4
vizitez 2
```

```visual
{"use": "dfs-stack"}
```

Aici un nod e marcat când e luat de pe stivă, nu când e pus, așa că **2** poate sta de două ori pe stivă: o dată de la **0**, o dată de la **4**. Un nod poate fi pus o dată pentru fiecare muchie care ajunge la el, de asta stiva are loc pentru **64**, mai mult decât îi poate trebui oricărui graf de aici. A doua oară când iese, e deja văzut și e sărit. Dacă l-ai marca atunci când e pus, ca la parcurgerea în lățime, pe unele grafuri ordinea n-ar mai fi cea pe care o dă parcurgerea recursivă

---

Un graf poate veni în **bucăți** separate, numite **componente conexe**: în fiecare, orice nod poate ajunge la oricare altul, și nicio muchie nu trece dintr-o bucată în alta. Graful de mai sus are trei: **0 1 2 3 4**, apoi **5 6**, apoi **7** singur

O parcurgere vizitează exact bucata în care pornește. Așa că, să găsești toate bucățile, treci prin noduri în ordine și pornește o parcurgere nouă din fiecare nod pe care nicio parcurgere nu l-a vizitat încă. Fiecare parcurgere nouă e o bucată nouă

```c
#include <stdio.h>

int vecini[8][8];
int numar[8];
int bucata[8];

void dfs(int u, int b) {
    bucata[u] = b;
    for (int i = 0; i < numar[u]; i++) {
        int v = vecini[u][i];
        if (bucata[v] == 0) {
            dfs(v, b);
        }
    }
}

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    for (int i = 0; i < m; i++) {
        int u, v;
        scanf("%d %d", &u, &v);
        vecini[u][numar[u]] = v;
        numar[u]++;
        vecini[v][numar[v]] = u;
        numar[v]++;
    }

    int bucati = 0;
    for (int v = 0; v < n; v++) {
        if (bucata[v] == 0) {
            bucati++;
            dfs(v, bucati);
        }
    }

    printf("bucati: %d\n", bucati);
    for (int v = 0; v < n; v++) {
        printf("%d ", bucata[v]);
    }
    printf("\n");
    return 0;
}
```

Rezultat

```text
bucati: 3
1 1 1 1 1 2 2 3
```

Iată cele trei parcurgeri, câte o bucată fiecare

```visual
{"use": "dfs-pieces"}
```

În loc de **1** și **0**, **bucata** ține numărul bucății în care e fiecare nod, cu **0** pentru „încă nevizitat”. Bucățile sunt numerotate de la **1**, în ordinea celui mai mic nod al lor, pentru că bucla trece prin noduri în ordine

Așa știe o aplicație de hărți că două locuri nu se pot atinge unul din celălalt, sau așa găsește o rețea calculatoarele tăiate de restul

---

## Misiune: Găsește bucățile

1. Citește un graf neorientat cu **scanf**: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie
2. Găsește-i bucățile cu o parcurgere în adâncime recursivă
3. Afișează **Bucati:** și câte sunt
4. Afișează câte o linie pentru fiecare bucată, numerotate de la **1** în ordinea celui mai mic nod al lor: **Bucata**, numărul ei, două puncte și nodurile ei de la cel mai mic la cel mai mare

**n** este de la 1 la 8, iar nodurile sunt numerotate de la 0 la **n - 1**. Nicio muchie nu unește un nod cu el însuși și nicio muchie nu apare de două ori. **m** poate fi 0

**Exemplu**

Intrare

```text
8 6
0 1
0 2
1 3
2 4
3 4
5 6
```

Ieșire

```text
Bucati: 3
Bucata 1: 0 1 2 3 4
Bucata 2: 5 6
Bucata 3: 7
```

**Exemplu**

Intrare

```text
6 3
4 0
2 5
5 3
```

Ieșire

```text
Bucati: 3
Bucata 1: 0 4
Bucata 2: 1
Bucata 3: 2 3 5
```
