O cameră de gardă nu tratează pacienții în ordinea în care au venit. Îl tratează întâi pe cel mai urgent, apoi pe cel mai urgent dintre cei rămași, iar pacienți noi tot sosesc. Un joc alege următorul eveniment care se întâmplă, un calculator următoarea sarcină de rulat, o aplicație de hărți cel mai apropiat loc pe care nu l-a verificat încă. De fiecare dată ai nevoie doar de cel mai mic dintre cele care așteaptă, nu de toată lista sortată

Asta este o **coadă cu priorități**, iar structura din spatele ei este un **heap** (în română i se mai spune și **movilă**)

---

Un **min-heap** este un arbore binar cu o singură regulă: fiecare nod este mai mic decât copiii lui. În lecția aceasta valorile sunt toate diferite, așa că „mai mic” nu trebuie să se descurce niciodată cu o egalitate

```text
          1
        /   \
       3     6
      / \   /
     5   9 8
```

Urmează orice drum în jos și valorile doar cresc, deci cea mai mică valoare dintre toate este mereu rădăcina. Nu se spune nimic despre stânga și dreapta: **3** e în stânga și **6** în dreapta, dar ar putea la fel de bine să fie invers. Un heap nu este un arbore binar de căutare

Un heap își păstrează și **forma**: fiecare nivel este plin, în afară poate de ultimul, iar ultimul se umple de la stânga, fără goluri. Arborelui de mai sus îi lipsește doar copilul drept al lui **6**, ultimul loc de pe ultimul nivel

---

Forma asta înseamnă că un heap nu are nevoie deloc de noduri. Citește-l nivel cu nivel, de la stânga la dreapta, într-o listă obișnuită

```text
          1                 index:   0  1  2  3  4  5
        /   \               valoare: 1  3  6  5  9  8
       3     6
      / \   /
     5   9 8
```

Muchiile nu se pierd, devin aritmetică. Pentru valoarea de la indexul **i**

- copilul ei stâng este la indexul **2 \* i + 1**
- copilul ei drept este la indexul **2 \* i + 2**
- părintele ei este la indexul **(i - 1) // 2**

**3** e la indexul 1, deci copiii lui sunt la 3 și 4: **5** și **9**. **8** e la indexul 5, deci părintele lui e la (5 - 1) // 2 = 2: **6**. Un index dincolo de capătul listei este un copil care nu există

---

**Adăugarea** unei valori trebuie să păstreze și forma, și regula. Forma hotărăște unde merge: următorul loc liber, adică finalul listei. Apoi regula se repară prin **urcare**: cât timp valoarea nouă e mai mică decât părintele ei, schimbă-le între ele

Adăugarea lui **2** în heap-ul de mai sus

```text
adauga 2 la indexul 6, copilul drept al lui 6

          1                 1  3  6  5  9  8  2
        /   \
       3     6
      / \   / \
     5   9 8   2

2 e mai mic decat parintele lui, 6: schimba-le

          1                 1  3  2  5  9  8  6
        /   \
       3     2
      / \   / \
     5   9 8   6

2 e mai mare decat parintele lui, 1: stop
```

Urcă un nivel la fiecare schimbare, deci nu face niciodată mai mulți pași decât înălțimea arborelui

```py
def heap_adauga(heap, valoare):
    heap.append(valoare)
    i = len(heap) - 1
    while i > 0:
        parinte = (i - 1) // 2
        if heap[i] < heap[parinte]:
            heap[i], heap[parinte] = heap[parinte], heap[i]
            i = parinte
        else:
            break


heap = []
for valoare in [5, 3, 8, 1, 9, 6]:
    heap_adauga(heap, valoare)
print(heap)
```

Rezultat **[1, 3, 6, 5, 9, 8]**

Este heap-ul de la începutul lecției, construit din valori care au venit amestecate

---

**Extragerea** scoate rădăcina, cea mai mică valoare. Golul rămas se umple cu **ultima** valoare din listă, așa că forma rămâne întreagă. Valoarea aceea e probabil prea mare pentru vârf, așa că **coboară**: cât timp unul dintre copiii ei e mai mic decât ea, schimb-o cu copilul **mai mic**. Schimbarea cu cel mai mic e cea care păstrează regula: el devine părintele celuilalt copil și e mai mic și decât acela

Extragerea din **1 3 2 5 9 8 6**

```text
scoate 1, muta ultima valoare, 6, in radacina

          6                 6  3  2  5  9  8
        /   \
       3     2
      / \   /
     5   9 8

6 are copiii 3 si 2; mai mic e 2, si e mai mic decat 6: schimba-le

          2                 2  3  6  5  9  8
        /   \
       3     6
      / \   /
     5   9 8

6 are copilul 8, mai mare decat 6: stop
```

```py
def heap_extrage(heap):
    minim = heap[0]
    ultima = heap.pop()
    if len(heap) > 0:
        heap[0] = ultima
        i = 0
        while True:
            stang = 2 * i + 1
            drept = 2 * i + 2
            copil = i
            if stang < len(heap) and heap[stang] < heap[copil]:
                copil = stang
            if drept < len(heap) and heap[drept] < heap[copil]:
                copil = drept
            if copil == i:
                break
            heap[i], heap[copil] = heap[copil], heap[i]
            i = copil
    return minim


heap = [1, 3, 2, 5, 9, 8, 6]
print(heap_extrage(heap))
print(heap)
```

Rezultat

```text
1
[2, 3, 6, 5, 9, 8]
```

**copil** pornește chiar ca **i** și ajunge să fie cel mai mic dintre cei trei. Dacă tot **i** rămâne, amândoi copiii sunt mai mari, iar valoarea și-a găsit locul

---

Adaugă tot, apoi extrage până se golește heap-ul, iar valorile ies începând cu cea mai mică

```py
def heap_adauga(heap, valoare):
    heap.append(valoare)
    i = len(heap) - 1
    while i > 0:
        parinte = (i - 1) // 2
        if heap[i] < heap[parinte]:
            heap[i], heap[parinte] = heap[parinte], heap[i]
            i = parinte
        else:
            break


def heap_extrage(heap):
    minim = heap[0]
    ultima = heap.pop()
    if len(heap) > 0:
        heap[0] = ultima
        i = 0
        while True:
            stang = 2 * i + 1
            drept = 2 * i + 2
            copil = i
            if stang < len(heap) and heap[stang] < heap[copil]:
                copil = stang
            if drept < len(heap) and heap[drept] < heap[copil]:
                copil = drept
            if copil == i:
                break
            heap[i], heap[copil] = heap[copil], heap[i]
            i = copil
    return minim


heap = []
for valoare in [5, 3, 8, 1, 9, 6]:
    heap_adauga(heap, valoare)

while len(heap) > 0:
    print(heap_extrage(heap), end=" ")
print()
```

Rezultat **1 3 5 6 8 9**

Asta este **heap sort**. O adăugare sau o extragere parcurge cel mult un drum de sus până jos, iar un heap e cât de scund poate fi un arbore cu atâtea noduri, așa că rămâne rapid chiar și cu milioane de valori

---

Python are și el un heap: modulul **heapq** ține o listă obișnuită ca min-heap, cu **heapq.heappush** și **heapq.heappop**. Face ce fac cele două funcții ale tale. În programele tale l-ai folosi pe el; aici îl construiești singur, ca să vezi cum funcționează pe dinăuntru

---

## Misiune: Folosește un heap

1. Începe programul cu două variabile: **valori**, o listă de numere întregi, și **extrageri**, un număr întreg. De exemplu `valori = [5, 3, 8, 1, 9, 6]` și `extrageri = 2`
2. Scrie o funcție care adaugă o valoare într-un min-heap ținut într-o listă, urcând-o, și o funcție care extrage cea mai mică valoare, coborând-o pe ultima
3. Pornind de la o listă goală, adaugă valorile una câte una, în ordinea din listă, și afișează **Heap:** și valorile din listă, în ordine
4. Extrage de **extrageri** ori și afișează **Extrase:** și valorile scoase, în ordinea în care le-ai scos
5. Afișează **Ramase:** și valorile rămase în listă, în ordine

Folosește funcțiile tale, nu **heapq** și nici sortare

**valori** are între 2 și 7 numere, toate diferite, fiecare de la -1000 la 1000. **extrageri** este cel puțin 1 și mai mic decât numărul de valori

**Exemplu** pentru valori = [5, 3, 8, 1, 9, 6] și extrageri = 2

```text
Heap: 1 3 6 5 9 8
Extrase: 1 3
Ramase: 5 8 6 9
```

**Exemplu** pentru valori = [40, 30, 20, 10] și extrageri = 1

```text
Heap: 10 20 30 40
Extrase: 10
Ramase: 20 40 30
```
