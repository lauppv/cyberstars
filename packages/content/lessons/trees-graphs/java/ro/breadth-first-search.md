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

Așa că ține un array **dist**, câte un număr pentru fiecare nod, toate **-1** la început, adică „încă nevăzut”: **Arrays.fill** pune aceeași valoare în fiecare celulă a unui array. Când un nod e văzut prima dată, scrie acolo distanța lui și pune-l în coadă. Un nod a cărui distanță nu mai e **-1** nu mai intră niciodată în coadă

---

Ia nodul din fața cozii. Fiecare vecin încă nevăzut e cu un pas mai departe de start decât el. Iată graful de mai sus, în intrarea obișnuită

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

```java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int m = scanner.nextInt();
        ArrayList<ArrayList<Integer>> vecini = new ArrayList<>();
        for (int v = 0; v < n; v++) {
            vecini.add(new ArrayList<>());
        }
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            vecini.get(u).add(v);
            vecini.get(v).add(u);
        }

        int start = 0;
        int[] dist = new int[n];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        Queue<Integer> coada = new ArrayDeque<>();
        coada.add(start);
        while (!coada.isEmpty()) {
            int u = coada.poll();
            System.out.println("vizitez " + u + " la distanta " + dist[u]);
            for (int v : vecini.get(u)) {
                if (dist[v] == -1) {
                    dist[v] = dist[u] + 1;
                    coada.add(v);
                }
            }
        }
    }
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

O celulă e o pereche, rândul ei **r** și coloana ei **c**, așa că în coadă stau perechi, fiecare un `int[]` de două numere. Vecinii ei nu sunt ținuți nicăieri: sunt cele patru celule de lângă ea, cele care sunt în grilă și libere

```java
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Queue;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int randuri = scanner.nextInt();
        int coloane = scanner.nextInt();
        String[] grila = new String[randuri];
        for (int r = 0; r < randuri; r++) {
            grila[r] = scanner.next();
        }

        int[][] dist = new int[randuri][coloane];
        for (int r = 0; r < randuri; r++) {
            Arrays.fill(dist[r], -1);
        }
        int[][] mutari = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        dist[0][0] = 0;
        Queue<int[]> coada = new ArrayDeque<>();
        coada.add(new int[] {0, 0});
        while (!coada.isEmpty()) {
            int[] celula = coada.poll();
            int r = celula[0];
            int c = celula[1];
            for (int[] mutare : mutari) {
                int nr = r + mutare[0];
                int nc = c + mutare[1];
                if (nr >= 0 && nr < randuri && nc >= 0 && nc < coloane) {
                    if (grila[nr].charAt(nc) == '.' && dist[nr][nc] == -1) {
                        dist[nr][nc] = dist[r][c] + 1;
                        coada.add(new int[] {nr, nc});
                    }
                }
            }
        }

        for (int r = 0; r < randuri; r++) {
            String linie = "";
            for (int c = 0; c < coloane; c++) {
                if (grila[r].charAt(c) == '#') {
                    linie += " #";
                } else {
                    linie += String.format("%2d", dist[r][c]);
                }
            }
            System.out.println(linie);
        }
        System.out.println("pasi pana la iesire: " + dist[randuri - 1][coloane - 1]);
    }
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

**String.format("%2d", x)** scrie **x** pe două poziții, ca să se alinieze coloanele. Parcurgerea e aceeași ca pe lista de muchii: s-a schimbat doar felul în care un nod își găsește vecinii

---

## Misiune: Numără pașii

1. Citește un graf neorientat: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie, iar după ele o linie cu două noduri, **s** și **t**
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
