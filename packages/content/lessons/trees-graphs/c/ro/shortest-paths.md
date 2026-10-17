Parcurgerea în lățime găsește drumul cu cele mai puține muchii. Pe o hartă, nu e mereu drumul pe care îl vrei. O autostradă cu trei ieșiri poate fi mai rapidă decât un drum îngust drept peste munte. Când fiecare muchie are lungimea ei, întrebarea devine: care drum are cel mai mic **total**?

---

Dă-i fiecărei muchii un număr, **costul** ei: o lungime în kilometri, un timp în minute, un preț. În intrare, fiecare linie cu o muchie primește un al treilea număr, costul

```visual
{"use": "dijkstra-roads"}
```

```text
5 6
0 1 4
0 2 1
1 2 2
1 3 5
2 3 8
3 4 3
```

Drumurile merg în ambele sensuri, așa că graful e neorientat. De la **0** la **3**, cele mai puține muchii sunt două, **0 1 3** sau **0 2 3**, și amândouă costă **9**. Dar **0 2 1 3** costă **1 + 2 + 5 = 8**: o muchie în plus, și mai scurt. Numărarea muchiilor nu mai ajunge

---

Lista de adiacență ține acum o pereche pentru fiecare vecin: nodul și costul muchiei care duce acolo. În C asta înseamnă două array-uri unul lângă altul, **vecini** pentru nod și **costuri** pentru cost, completate pe același loc

```visual
{"use": "dijkstra-list"}
```

---

**Algoritmul lui Dijkstra** găsește cea mai mică distanță de la un nod de start la fiecare alt nod. Ține un **dist** pentru fiecare nod: cel mai scurt drum găsit până acum, sau **-1** cât timp nu există niciunul. La început doar startul are unul, **0**

Apoi, iar și iar: ia nodul cu cel mai mic **dist** care nu e încă terminat și marchează-l terminat. Pentru fiecare vecin al lui, vezi dacă drumul prin el e mai scurt decât ce are vecinul. Dacă e, acesta e noul **dist** al vecinului

```visual
{"use": "dijkstra-dist"}
```

**1** primește întâi **4**, direct de la **0**. Când e luat **2**, drumul prin el costă **1 + 2 = 3**, așa că **1** scade la **3**. **3** primește **9** prin **2**, apoi **8** prin **1**

Nodul luat nu mai e îmbunătățit niciodată mai târziu. Toate costurile sunt pozitive, așa că orice alt drum până la el ar trece printr-un nod neterminat, al cărui **dist** e cel puțin la fel de mare, și apoi ar mai adăuga ceva. Tot de aceea algoritmul lui Dijkstra are nevoie de costuri de **0** sau mai mari: o muchie cu cost negativ ar putea face până la urmă un nod terminat mai ieftin

---

Să găsești cel mai mic nod neterminat e exact ce face un heap, ca cel pe care l-ai construit în lecția despre heap-uri. Dar cu cel mult **8** noduri nu e nevoie de unul: treci prin toate și păstrează-l pe cel neterminat cu cel mai mic **dist**, cum a găsit ordinea topologică cel mai mic nod gata. Sunt **n** verificări pentru fiecare dintre cei **n** pași, repede pentru un graf mic

```c
#include <stdio.h>

int main(void) {
    int n, m;
    scanf("%d %d", &n, &m);
    int vecini[8][8];
    int costuri[8][8];
    int numar[8] = {0};
    for (int i = 0; i < m; i++) {
        int u, v, cost;
        scanf("%d %d %d", &u, &v, &cost);
        vecini[u][numar[u]] = v;
        costuri[u][numar[u]] = cost;
        numar[u]++;
        vecini[v][numar[v]] = u;
        costuri[v][numar[v]] = cost;
        numar[v]++;
    }

    int start = 0;
    int dist[8];
    int facut[8] = {0};
    for (int v = 0; v < n; v++) {
        dist[v] = -1;
    }
    dist[start] = 0;
    for (int pas = 0; pas < n; pas++) {
        int u = -1;
        for (int v = 0; v < n; v++) {
            if (!facut[v] && dist[v] != -1 && (u == -1 || dist[v] < dist[u])) {
                u = v;
            }
        }
        if (u == -1) {
            break;
        }
        facut[u] = 1;
        for (int i = 0; i < numar[u]; i++) {
            int v = vecini[u][i];
            int cost = costuri[u][i];
            if (dist[v] == -1 || dist[u] + cost < dist[v]) {
                dist[v] = dist[u] + cost;
            }
        }
    }

    for (int v = 0; v < n; v++) {
        printf("%d ", dist[v]);
    }
    printf("\n");
    return 0;
}
```

Rezultat

```text
0 3 1 8 11
```

Când niciun nod neterminat nu mai are un **dist**, cele rămase la **-1** nu pot fi atinse deloc, așa că parcurgerea se oprește: **u** rămâne **-1**

---

## Misiune: Găsește cele mai scurte drumuri

1. Citește un graf neorientat cu costuri cu **scanf**: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie, **u v c**, iar după ele o linie cu nodul de start **s**
2. Află cea mai mică distanță de la **s** la fiecare nod cu algoritmul lui Dijkstra, alegând următorul nod trecând prin toate
3. Afișează câte o linie pentru fiecare nod, de la **0** la **n - 1**: nodul, două puncte și distanța lui de la **s**, sau **-1** dacă nu se poate ajunge la el

**n** este de la 1 la 8, iar nodurile sunt numerotate de la 0 la **n - 1**. Fiecare cost este un număr întreg de la 1 la 100. Nicio muchie nu unește un nod cu el însuși și nicio pereche de noduri nu e unită de două ori. **m** poate fi 0

**Exemplu**

Intrare

```text
5 6
0 1 4
0 2 1
1 2 2
1 3 5
2 3 8
3 4 3
0
```

Ieșire

```text
0: 0
1: 3
2: 1
3: 8
4: 11
```

**Exemplu**

Intrare

```text
6 5
0 1 7
1 2 1
0 2 10
2 3 2
4 5 3
3
```

Ieșire

```text
0: 10
1: 3
2: 2
3: 0
4: -1
5: -1
```
