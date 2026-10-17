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

**input()** citește o linie ca text. **split()** o taie la spații, iar **map(int, ...)** transformă fiecare bucată într-un număr

```py
n, m = map(int, input().split())
print("noduri:", n)
print("muchii:", m)
for i in range(m):
    u, v = map(int, input().split())
    print("muchie de la", u, "la", v)
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

```py
n, m = map(int, input().split())
matrice = [[0] * n for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    matrice[u][v] = 1
    matrice[v][u] = 1

for rand in matrice:
    print(*rand)

print(matrice[1][3] == 1)
print(matrice[2][4] == 1)
```

Pentru intrarea de mai sus, rezultatul este

```text
0 1 1 0 0
1 0 1 1 0
1 1 0 0 0
0 1 0 0 1
0 0 0 1 0
True
False
```

**print(\*rand)** afișează elementele unei liste separate prin spații. Iar rândurile fă-le cu o buclă, ca mai sus: `[[0] * n] * n` arată la fel, dar e un singur rând repetat de **n** ori, așa că dacă scrii o celulă se schimbă toată coloana

Matricea răspunde la „sunt unite?” dintr-un pas. Dar ocupă **n × n** celule chiar și când sunt puține muchii, iar ca să găsești vecinii unui nod trebuie să treci prin tot rândul lui

---

Al doilea mod este o **listă de adiacență**: pentru fiecare nod, lista vecinilor lui. În Python, asta e o listă de liste, câte una pentru fiecare nod

```visual
{"use": "graph-list"}
```

Fiecare muchie **u v** îl adaugă pe **v** în lista lui **u** și, pentru că graful e neorientat, pe **u** în lista lui **v**

```py
n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)

for v in range(n):
    print(f"{v}:", *vecini[v])

print("vecinii lui 1:", len(vecini[1]))
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

Lista păstrează doar muchiile care există, iar vecinii unui nod sunt chiar acolo, în ordinea în care le-au fost citite muchiile. De asta au nevoie cele mai multe parcurgeri de grafuri, așa că lecțiile următoare o folosesc cel mai des

---

Într-un graf orientat, o muchie **u v** merge doar de la **u** la **v**: umple doar **matrice[u][v]** și îl adaugă pe **v** în lista lui **u**, fără să pună nimic în lista lui **v**

```visual
{"use": "graph-directed-store"}
```

Acesta e graful cu săgeți de mai devreme

---

## Misiune: Desenează rețeaua

1. Citește un graf neorientat: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie
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
