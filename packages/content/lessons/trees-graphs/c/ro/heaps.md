O cameră de gardă nu tratează pacienții în ordinea în care au venit. Îl tratează întâi pe cel mai urgent, apoi pe cel mai urgent dintre cei rămași, iar pacienți noi tot sosesc. Un joc alege următorul eveniment care se întâmplă, un calculator următoarea sarcină de rulat, o aplicație de hărți cel mai apropiat loc pe care nu l-a verificat încă. De fiecare dată îți trebuie doar cea mai mică dintre valorile care așteaptă, nu toată lista sortată

Asta este o **coadă cu priorități**, iar structura din spatele ei este un **heap**

---

Un **min-heap** este un arbore binar cu o singură regulă: fiecare nod e mai mic decât copiii lui. În lecția asta valorile sunt toate diferite, așa că „mai mic” nu trebuie să se ocupe niciodată de o egalitate

```text
          1
        /   \
       3     6
      / \   /
     5   9 8
```

Urmează orice drum în jos și valorile doar cresc, deci cea mai mică valoare dintre toate e mereu rădăcina. Despre stânga și dreapta nu se spune nimic: **3** e în stânga și **6** în dreapta, dar ar putea la fel de bine să fie invers. Un heap nu este un arbore binar de căutare

Un heap își păstrează și **forma**: fiecare nivel e plin, poate cu excepția ultimului, iar ultimul se umple de la stânga, fără goluri. Arborelui de mai sus îi lipsește doar copilul drept al lui **6**, ultimul loc de pe ultimul nivel

---

Forma asta înseamnă că un heap nu are nevoie de noduri, de pointeri sau de **malloc**. Citește-l nivel cu nivel, de la stânga la dreapta, într-un array simplu

```text
          1                 indice:   0  1  2  3  4  5
        /   \               valoare:  1  3  6  5  9  8
       3     6
      / \   /
     5   9 8
```

Muchiile nu se pierd, sunt aritmetică. Pentru valoarea de la indicele **i**

- copilul ei stâng e la indicele **2 \* i + 1**
- copilul ei drept e la indicele **2 \* i + 2**
- părintele ei e la indicele **(i - 1) / 2**

**3** e la indicele 1, deci copiii lui sunt la 3 și 4: **5** și **9**. **8** e la indicele 5, deci părintele lui e la (5 - 1) / 2 = 2: **6**. Împărțirea a doi int aruncă restul, exact ce îi trebuie părintelui: și (6 - 1) / 2 dă tot 2. Un indice egal cu **marime** sau mai mare înseamnă un copil care nu există

Array-ul are o lungime fixă, așa că heap-ul își ține propria **marime**, numărul de valori din el, lângă array. Locurile de după **marime** sunt spațiu liber

---

**Adăugarea** unei valori trebuie să păstreze și forma, și regula. Forma hotărăște unde merge: următorul loc liber, adică indicele **marime**. Apoi regula se repară **urcând-o**: cât timp valoarea nouă e mai mică decât părintele ei, schimbă-le între ele

Adăugarea lui **2** în heap-ul de mai sus

```text
pune 2 la indicele 6, copilul drept al lui 6

          1                 1  3  6  5  9  8  2
        /   \
       3     6
      / \   / \
     5   9 8   2

2 e mai mic decat parintele lui, 6: schimba-i

          1                 1  3  2  5  9  8  6
        /   \
       3     2
      / \   / \
     5   9 8   6

2 e mai mare decat parintele lui, 1: stop
```

Urcă un nivel la fiecare schimbare, deci nu face niciodată mai mulți pași decât înălțimea arborelui

**heap_adauga** schimbă mărimea, așa că primește un pointer către ea, `int *marime`, și scrie prin el

```c
#include <stdio.h>

void heap_adauga(int heap[], int *marime, int valoare) {
    heap[*marime] = valoare;
    int i = *marime;
    *marime = *marime + 1;
    while (i > 0) {
        int parinte = (i - 1) / 2;
        if (heap[i] < heap[parinte]) {
            int temp = heap[i];
            heap[i] = heap[parinte];
            heap[parinte] = temp;
            i = parinte;
        } else {
            break;
        }
    }
}

int main(void) {
    int heap[10];
    int marime = 0;
    int valori[] = {5, 3, 8, 1, 9, 6};
    for (int i = 0; i < 6; i++) {
        heap_adauga(heap, &marime, valori[i]);
    }
    for (int i = 0; i < marime; i++) {
        printf("%d ", heap[i]);
    }
    printf("\n");
    return 0;
}
```

Rezultat **1 3 6 5 9 8**

E heap-ul de la începutul lecției, construit din valori care au venit amestecate

---

**Extragerea** scoate rădăcina, cea mai mică valoare. Golul pe care îl lasă e umplut cu **ultima** valoare din heap, ca forma să rămână întreagă. Valoarea aceea e probabil prea mare pentru vârf, așa că **coboară**: cât timp unul dintre copiii ei e mai mic decât ea, schimb-o cu copilul **mai mic**. Schimbarea cu cel mai mic e ce păstrează regula: el devine părintele celuilalt copil și e mai mic și decât acela

Extragerea din **1 3 2 5 9 8 6**

```text
scoate 1, muta ultima valoare, 6, in radacina

          6                 6  3  2  5  9  8
        /   \
       3     2
      / \   /
     5   9 8

6 are copiii 3 si 2; cel mai mic e 2 si e mai mic decat 6: schimba-i

          2                 2  3  6  5  9  8
        /   \
       3     6
      / \   /
     5   9 8

6 are copilul 8, mai mare decat 6: stop
```

```c
#include <stdio.h>

int heap_extrage(int heap[], int *marime) {
    int minim = heap[0];
    *marime = *marime - 1;
    heap[0] = heap[*marime];
    int i = 0;
    while (1) {
        int stanga = 2 * i + 1;
        int dreapta = 2 * i + 2;
        int copil = i;
        if (stanga < *marime && heap[stanga] < heap[copil]) {
            copil = stanga;
        }
        if (dreapta < *marime && heap[dreapta] < heap[copil]) {
            copil = dreapta;
        }
        if (copil == i) {
            break;
        }
        int temp = heap[i];
        heap[i] = heap[copil];
        heap[copil] = temp;
        i = copil;
    }
    return minim;
}

int main(void) {
    int heap[10] = {1, 3, 2, 5, 9, 8, 6};
    int marime = 7;
    printf("%d\n", heap_extrage(heap, &marime));
    for (int i = 0; i < marime; i++) {
        printf("%d ", heap[i]);
    }
    printf("\n");
    return 0;
}
```

Rezultat

```text
1
2 3 6 5 9 8
```

**copil** pornește ca **i** însuși și ajunge să fie cel mai mic dintre cei trei. Dacă e tot **i**, amândoi copiii sunt mai mari și valoarea și-a găsit locul

---

Adaugă totul, apoi extrage până se golește heap-ul, și valorile ies de la cea mai mică

```c
#include <stdio.h>

void heap_adauga(int heap[], int *marime, int valoare) {
    heap[*marime] = valoare;
    int i = *marime;
    *marime = *marime + 1;
    while (i > 0) {
        int parinte = (i - 1) / 2;
        if (heap[i] < heap[parinte]) {
            int temp = heap[i];
            heap[i] = heap[parinte];
            heap[parinte] = temp;
            i = parinte;
        } else {
            break;
        }
    }
}

int heap_extrage(int heap[], int *marime) {
    int minim = heap[0];
    *marime = *marime - 1;
    heap[0] = heap[*marime];
    int i = 0;
    while (1) {
        int stanga = 2 * i + 1;
        int dreapta = 2 * i + 2;
        int copil = i;
        if (stanga < *marime && heap[stanga] < heap[copil]) {
            copil = stanga;
        }
        if (dreapta < *marime && heap[dreapta] < heap[copil]) {
            copil = dreapta;
        }
        if (copil == i) {
            break;
        }
        int temp = heap[i];
        heap[i] = heap[copil];
        heap[copil] = temp;
        i = copil;
    }
    return minim;
}

int main(void) {
    int heap[10];
    int marime = 0;
    int valori[] = {5, 3, 8, 1, 9, 6};
    for (int i = 0; i < 6; i++) {
        heap_adauga(heap, &marime, valori[i]);
    }
    while (marime > 0) {
        printf("%d ", heap_extrage(heap, &marime));
    }
    printf("\n");
    return 0;
}
```

Rezultat **1 3 5 6 8 9**

Asta e **heap sort**. O adăugare sau o extragere parcurge cel mult un drum de sus până jos, iar un heap e cât de scund poate fi un arbore cu atâtea noduri, așa că rămâne rapid chiar și cu milioane de valori

---

Biblioteca standard a lui C nu are un heap, așa că în C ai scrie singur aceste două funcții, exact cum ai făcut aici. Multe alte limbaje au unul: Python are **heapq**, Java are **PriorityQueue**, iar înăuntru fac ce fac cele două funcții ale tale

---

## Misiune: Folosește un heap

1. Citește intrarea cu **scanf**: pe prima linie **n**, câte valori sunt, pe a doua linie cele **n** valori, iar pe a treia linie **extrageri**, câte valori să extragi
2. Scrie o funcție care adaugă o valoare într-un min-heap ținut într-un array, urcând-o, și o funcție care extrage cea mai mică valoare, coborând-o pe ultima
3. Pornind de la un heap gol, adaugă valorile una câte una, în ordinea în care au fost citite, și afișează **Heap:** și valorile din heap, în ordinea din array
4. Extrage de **extrageri** ori și afișează **Extrase:** și valorile scoase, în ordinea în care le-ai scos
5. Afișează **Ramase:** și valorile rămase în heap, în ordinea din array

Folosește funcțiile tale, nu sortarea

**n** este de la 2 la 7, valorile sunt toate diferite, fiecare de la -1000 la 1000, iar **extrageri** este cel puțin 1 și mai mic decât **n**

**Exemplu**

Intrare

```text
6
5 3 8 1 9 6
2
```

Ieșire

```text
Heap: 1 3 6 5 9 8
Extrase: 1 3
Ramase: 5 8 6 9
```

**Exemplu**

Intrare

```text
4
40 30 20 10
1
```

Ieșire

```text
Heap: 10 20 30 40
Extrase: 10
Ramase: 20 40 30
```
