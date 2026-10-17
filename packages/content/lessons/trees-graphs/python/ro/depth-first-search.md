Parcurgerea în lățime se întinde ca o undă, câte un inel pe rând. Există și alt fel de a explora: alegi un drum și îl urmezi cât de departe merge, iar abia când te blochezi, te întorci la ultimul loc unde ai avut de ales. Așa ai explora o peșteră, și asta este o **parcurgere în adâncime**, sau **DFS** (din engleză, depth-first search)

---

Ai parcurs deja un arbore așa: parcurgerea în preordine coboară până jos pe partea stângă înainte să se întoarcă după cea dreaptă. Pe un graf e aceeași parcurgere, cu semnele de **văzut** de care a avut nevoie și parcurgerea în lățime, pentru că un graf te poate duce înapoi la un nod pe care l-ai vizitat deja

```text
    0 ----- 1       5
    |       |       |
    |       |       |
    2       3       6
     \     /
      \   /         7
        4
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

Parcurgerea recursivă are câteva linii. Marchează nodul, apoi intră în adâncime în fiecare vecin încă nevăzut

```py
n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)

vazut = [False] * n


def dfs(u):
    vazut[u] = True
    print("vizitez", u)
    for v in vecini[u]:
        if not vazut[v]:
            dfs(v)


dfs(0)
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

```text
dfs(0)                 vecini 1, 2
  dfs(1)               vecini 0, 3
    dfs(3)             vecini 1, 4
      dfs(4)           vecini 2, 3
        dfs(2)         vecini 0, 4: amandoi vazuti, inapoi
      inapoi in dfs(4) 3 e vazut, inapoi
    inapoi in dfs(3)   nu mai e nimic, inapoi
  inapoi in dfs(1)     nu mai e nimic, inapoi
inapoi in dfs(0)       2 e vazut acum, gata
```

**2** e vecin cu **0**, dar e vizitat ultimul: parcurgerea a ajuns la el pe drumul lung, prin **1**, **3** și **4**, înainte ca **0** să ajungă la el. Parcurgerea în lățime ar vizita **0 1 2 3 4**. Amândouă ating aceleași noduri, doar ordinea diferă

Iar **5**, **6** și **7** nu sunt vizitate niciodată: nicio muchie nu duce la ele de la **0**

---

Recursivitatea ține minte unde să se întoarcă: fiecare apel deschis e un loc unde mai e ceva de ales. Poți ține tu evidența asta cu o **stivă**, o grămadă în care ultimul lucru pus e primul luat, ca un teanc de farfurii

În Python, o listă e o stivă: **append** pune un element deasupra, iar **pop()** îl ia pe cel de deasupra

```py
stiva = []
stiva.append("farfuria 1")
stiva.append("farfuria 2")
stiva.append("farfuria 3")
print(stiva.pop())
print(stiva.pop())
print(len(stiva))
```

Rezultat

```text
farfuria 3
farfuria 2
1
```

Parcurgerea ia un nod de deasupra, îl vizitează dacă nu e încă văzut și îi pune vecinii pe stivă. Vecinul pus ultimul e cel luat următorul, așa că parcurgerea merge tot mai adânc. Dacă îi pui în ordine **inversă** (**reversed**), primul vecin iese primul și obții aceeași ordine ca la recursivitate

```py
n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)

vazut = [False] * n
stiva = [0]
while len(stiva) > 0:
    u = stiva.pop()
    if vazut[u]:
        continue
    vazut[u] = True
    print("vizitez", u)
    for v in reversed(vecini[u]):
        if not vazut[v]:
            stiva.append(v)
```

Rezultat

```text
vizitez 0
vizitez 1
vizitez 3
vizitez 4
vizitez 2
```

```text
iau    stiva dupa
       [0]
0      [2, 1]
1      [2, 3]
3      [2, 4]
4      [2, 2]
2      [2]
2      []        deja vazut, sarit
```

Aici un nod e marcat când e luat de pe stivă, nu când e pus, așa că **2** poate sta de două ori pe stivă: o dată de la **0**, o dată de la **4**. A doua oară când iese, e deja văzut și e sărit. Dacă l-ai marca atunci când e pus, ca la parcurgerea în lățime, pe unele grafuri ordinea n-ar mai fi cea pe care o dă parcurgerea recursivă

---

Un graf poate veni în **bucăți** separate, numite **componente conexe**: în fiecare, orice nod poate ajunge la oricare altul, și nicio muchie nu trece dintr-o bucată în alta. Graful de mai sus are trei: **0 1 2 3 4**, apoi **5 6**, apoi **7** singur

O parcurgere vizitează exact bucata în care pornește. Așa că, să găsești toate bucățile, treci prin noduri în ordine și pornește o parcurgere nouă din fiecare nod pe care nicio parcurgere nu l-a vizitat încă. Fiecare parcurgere nouă e o bucată nouă

```py
n, m = map(int, input().split())
vecini = [[] for i in range(n)]
for i in range(m):
    u, v = map(int, input().split())
    vecini[u].append(v)
    vecini[v].append(u)

bucata = [0] * n


def dfs(u, b):
    bucata[u] = b
    for v in vecini[u]:
        if bucata[v] == 0:
            dfs(v, b)


numar = 0
for v in range(n):
    if bucata[v] == 0:
        numar += 1
        dfs(v, numar)

print("bucati:", numar)
print(bucata)
```

Rezultat

```text
bucati: 3
[1, 1, 1, 1, 1, 2, 2, 3]
```

În loc de **True** și **False**, **bucata** ține numărul bucății în care e fiecare nod, cu **0** pentru „încă nevizitat”. Bucățile sunt numerotate de la **1**, în ordinea celui mai mic nod al lor, pentru că bucla trece prin noduri în ordine

Așa știe o aplicație de hărți că două locuri nu se pot atinge unul din celălalt, sau așa găsește o rețea calculatoarele tăiate de restul

---

## Misiune: Găsește bucățile

1. Citește un graf neorientat: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie
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
