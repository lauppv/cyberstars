Parcurgerea în lățime găsește drumul cu cele mai puține muchii. Pe o hartă, nu e mereu drumul pe care îl vrei. O autostradă cu trei ieșiri poate fi mai rapidă decât un drum îngust drept peste munte. Când fiecare muchie are lungimea ei, întrebarea devine: care drum are cel mai mic **total**?

---

Dă-i fiecărei muchii un număr, **costul** ei: o lungime în kilometri, un timp în minute, un preț. În intrare, fiecare linie cu o muchie primește un al treilea număr, costul

```text
    0 ----4---- 1 ----5---- 3 ----3---- 4
    |           |           |
    1           2           |
    |           |           |
    2 ----------+           |
    |                       |
    +-----------8-----------+
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

Lista de adiacență ține acum o pereche pentru fiecare vecin, un `int[]` de două numere: nodul și costul muchiei care duce acolo

```text
0: (1, 4) (2, 1)
1: (0, 4) (2, 2) (3, 5)
2: (0, 1) (1, 2) (3, 8)
3: (1, 5) (2, 8) (4, 3)
4: (3, 3)
```

---

**Algoritmul lui Dijkstra** găsește cea mai mică distanță de la un nod de start la fiecare alt nod. Ține un **dist** pentru fiecare nod: cel mai scurt drum găsit până acum, sau **-1** cât timp nu există niciunul. La început doar startul are unul, **0**

Apoi, iar și iar: ia nodul cu cel mai mic **dist** care nu e încă terminat și marchează-l terminat. Pentru fiecare vecin al lui, vezi dacă drumul prin el e mai scurt decât ce are vecinul. Dacă e, acesta e noul **dist** al vecinului

```text
iau    dist dupa (0 1 2 3 4)
       0  -  -  -  -
0      0  4  1  -  -
2      0  3  1  9  -
1      0  3  1  8  -
3      0  3  1  8  11
4      0  3  1  8  11
```

**1** primește întâi **4**, direct de la **0**. Când e luat **2**, drumul prin el costă **1 + 2 = 3**, așa că **1** scade la **3**. **3** primește **9** prin **2**, apoi **8** prin **1**

Nodul luat nu mai e îmbunătățit niciodată mai târziu. Toate costurile sunt pozitive, așa că orice alt drum până la el ar trece printr-un nod neterminat, al cărui **dist** e cel puțin la fel de mare, și apoi ar mai adăuga ceva. Tot de aceea algoritmul lui Dijkstra are nevoie de costuri de **0** sau mai mari: o muchie cu cost negativ ar putea face până la urmă un nod terminat mai ieftin

---

Să găsești cel mai mic nod neterminat e treaba unui heap, cel din lecția despre heap-uri. **PriorityQueue** din Java e unul: **add** pune o valoare, **poll** o scoate pe cea mai mică. Pune în el perechi, fiecare un `int[]` de forma **{distanta, nod}**. O pereche nu e un număr, așa că coada trebuie să afle cum să compare două: `(a, b) -> a[0] - b[0]` spune că după primul element, distanța, așa că cea mai mică distanță iese prima

```java
import java.util.ArrayList;
import java.util.Arrays;
import java.util.PriorityQueue;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<int[]>> vecini = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            vecini.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            int cost = scanner.nextInt();
            vecini.get(u).add(new int[] {v, cost});
            vecini.get(v).add(new int[] {u, cost});
        }

        int start = 0;
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        heap.add(new int[] {0, start});
        while (!heap.isEmpty()) {
            int[] varf = heap.poll();
            int d = varf[0];
            int u = varf[1];
            if (d > dist[u]) {
                continue;
            }
            for (int[] muchie : vecini.get(u)) {
                int v = muchie[0];
                int cost = muchie[1];
                if (dist[v] == -1 || d + cost < dist[v]) {
                    dist[v] = d + cost;
                    heap.add(new int[] {dist[v], v});
                }
            }
        }

        System.out.println(Arrays.toString(dist));
    }
}
```

Rezultat

```text
[0, 3, 1, 8, 11]
```

**Arrays.toString** scrie un array întreg între paranteze drepte

Un heap nu poate schimba o valoare aflată deja în el, așa că atunci când **1** scade de la **4** la **3**, perechea nouă intră, iar cea veche rămâne. Iese mai târziu, după ce **1** e terminat, iar **d > dist[u]** o observă și o sare

```text
iau       heap dupa, cea mai mica prima
          (0, 0)
(0, 0)    (1, 2) (4, 1)
(1, 2)    (3, 1) (4, 1) (9, 3)
(3, 1)    (4, 1) (8, 3) (9, 3)
(4, 1)    (8, 3) (9, 3)             veche, sarita
(8, 3)    (9, 3) (11, 4)
(9, 3)    (11, 4)                   veche, sarita
(11, 4)
```

---

## Misiune: Găsește cele mai scurte drumuri

1. Citește un graf neorientat cu costuri: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie, **u v c**, iar după ele o linie cu nodul de start **s**
2. Află cea mai mică distanță de la **s** la fiecare nod cu algoritmul lui Dijkstra, folosind un heap
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
