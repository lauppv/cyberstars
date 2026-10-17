O cameră de gardă nu tratează pacienții în ordinea în care au venit. Îl tratează întâi pe cel mai urgent, apoi pe cel mai urgent dintre cei rămași, iar pacienți noi tot sosesc. Un joc alege următorul eveniment care se întâmplă, un calculator următoarea sarcină de rulat, o aplicație de hărți cel mai apropiat loc pe care nu l-a verificat încă. De fiecare dată îți trebuie doar cel mai mic dintre cei care așteaptă, nu toată lista sortată

Asta este o **coadă cu priorități**, iar structura din spatele ei este un **heap**

---

Un **min-heap** este un arbore binar cu o singură regulă: fiecare nod este mai mic decât copiii lui. În lecția asta valorile sunt toate diferite, așa că „mai mic” nu trebuie să se descurce niciodată cu o egalitate

```text
          1
        /   \
       3     6
      / \   /
     5   9 8
```

Urmează orice drum în jos și valorile doar cresc, deci cea mai mică valoare dintre toate este mereu rădăcina. Despre stânga și dreapta nu se spune nimic: **3** e în stânga și **6** în dreapta, dar ar putea fi la fel de bine invers. Un heap nu este un arbore binar de căutare

Un heap își păstrează și **forma**: fiecare nivel e plin, poate cu excepția ultimului, iar ultimul se umple de la stânga, fără goluri. Arborelui de mai sus îi lipsește doar copilul drept al lui **6**, ultimul loc de pe ultimul nivel

---

Forma asta înseamnă că un heap nu are nevoie deloc de noduri. Citește-l nivel cu nivel, de la stânga la dreapta, într-o simplă listă

```text
          1                 index:   0  1  2  3  4  5
        /   \               valoare: 1  3  6  5  9  8
       3     6
      / \   /
     5   9 8
```

Muchiile nu se pierd, devin aritmetică. Pentru valoarea de la indexul **i**

- copilul ei stâng e la indexul **2 \* i + 1**
- copilul ei drept e la indexul **2 \* i + 2**
- părintele ei e la indexul **(i - 1) / 2**, o împărțire de `int` care lasă restul deoparte

**3** e la indexul 1, deci copiii lui sunt la 3 și 4: **5** și **9**. **8** e la indexul 5, deci părintele lui e la (5 - 1) / 2 = 2: **6**. Un index dincolo de capătul listei e un copil care nu există

Heap-ul crește și scade, așa că un `ArrayList<Integer>` i se potrivește mai bine decât un tablou: **add** pune o valoare la sfârșit, **remove** scoate una, iar lista își ține singură mărimea

---

**Adăugarea** unei valori trebuie să păstreze și forma, și regula. Forma hotărăște unde merge: în următorul loc liber, adică la sfârșitul listei. Apoi regula se repară prin **urcare**: cât timp valoarea nouă e mai mică decât părintele ei, schimbă-le între ele

Adăugăm **2** în heap-ul de mai sus

```visual
{"use": "heap-push"}
```

Urcă un nivel la fiecare schimbare, deci nu face niciodată mai mulți pași decât e de înalt arborele. O mică metodă **schimba** ține schimbările scurte

```java
import java.util.ArrayList;

public class Main {
    static void schimba(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static void adaugaInHeap(ArrayList<Integer> heap, int valoare) {
        heap.add(valoare);
        int i = heap.size() - 1;
        while (i > 0) {
            int parinte = (i - 1) / 2;
            if (heap.get(i) < heap.get(parinte)) {
                schimba(heap, i, parinte);
                i = parinte;
            } else {
                break;
            }
        }
    }

    public static void main(String[] args) {
        ArrayList<Integer> heap = new ArrayList<>();
        int[] valori = {5, 3, 8, 1, 9, 6};
        for (int valoare : valori) {
            adaugaInHeap(heap, valoare);
        }
        System.out.println(heap);
    }
}
```

Rezultat **[1, 3, 6, 5, 9, 8]**

Este heap-ul de la începutul lecției, construit din valori care au venit amestecate

---

**Scoaterea** ia rădăcina, cea mai mică valoare. Golul rămas se umple cu **ultima** valoare din listă, ca forma să rămână întreagă. Valoarea aceea e probabil prea mare pentru vârf, așa că **coboară**: cât timp unul dintre copiii ei e mai mic decât ea, schimb-o cu copilul **mai mic**. Schimbarea cu cel mai mic e cea care păstrează regula: el devine părintele celuilalt copil și e mai mic și decât acela

Scoatem din **1 3 2 5 9 8 6**

```visual
{"use": "heap-pop"}
```

```java
import java.util.ArrayList;

public class Main {
    static void schimba(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static int scoateDinHeap(ArrayList<Integer> heap) {
        int celMaiMic = heap.get(0);
        int ultim = heap.remove(heap.size() - 1);
        if (heap.size() > 0) {
            heap.set(0, ultim);
            int i = 0;
            while (true) {
                int stanga = 2 * i + 1;
                int dreapta = 2 * i + 2;
                int copil = i;
                if (stanga < heap.size() && heap.get(stanga) < heap.get(copil)) {
                    copil = stanga;
                }
                if (dreapta < heap.size() && heap.get(dreapta) < heap.get(copil)) {
                    copil = dreapta;
                }
                if (copil == i) {
                    break;
                }
                schimba(heap, i, copil);
                i = copil;
            }
        }
        return celMaiMic;
    }

    public static void main(String[] args) {
        ArrayList<Integer> heap = new ArrayList<>();
        int[] valori = {1, 3, 2, 5, 9, 8, 6};
        for (int valoare : valori) {
            heap.add(valoare);
        }
        System.out.println(scoateDinHeap(heap));
        System.out.println(heap);
    }
}
```

Rezultat

```text
1
[2, 3, 6, 5, 9, 8]
```

**copil** pornește chiar de la **i** și ajunge să fie cel mai mic dintre cei trei. Dacă tot **i** rămâne, ambii copii sunt mai mari, iar valoarea și-a găsit locul. **heap.remove(heap.size() - 1)** scoate ultima valoare și o întoarce, așa că lista e mai scurtă cu una înainte să înceapă coborârea

---

Adaugă tot, apoi scoate până se golește heap-ul, și valorile ies de la cea mai mică

```java
import java.util.ArrayList;

public class Main {
    static void schimba(ArrayList<Integer> heap, int i, int j) {
        int temp = heap.get(i);
        heap.set(i, heap.get(j));
        heap.set(j, temp);
    }

    static void adaugaInHeap(ArrayList<Integer> heap, int valoare) {
        heap.add(valoare);
        int i = heap.size() - 1;
        while (i > 0) {
            int parinte = (i - 1) / 2;
            if (heap.get(i) < heap.get(parinte)) {
                schimba(heap, i, parinte);
                i = parinte;
            } else {
                break;
            }
        }
    }

    static int scoateDinHeap(ArrayList<Integer> heap) {
        int celMaiMic = heap.get(0);
        int ultim = heap.remove(heap.size() - 1);
        if (heap.size() > 0) {
            heap.set(0, ultim);
            int i = 0;
            while (true) {
                int stanga = 2 * i + 1;
                int dreapta = 2 * i + 2;
                int copil = i;
                if (stanga < heap.size() && heap.get(stanga) < heap.get(copil)) {
                    copil = stanga;
                }
                if (dreapta < heap.size() && heap.get(dreapta) < heap.get(copil)) {
                    copil = dreapta;
                }
                if (copil == i) {
                    break;
                }
                schimba(heap, i, copil);
                i = copil;
            }
        }
        return celMaiMic;
    }

    public static void main(String[] args) {
        ArrayList<Integer> heap = new ArrayList<>();
        int[] valori = {5, 3, 8, 1, 9, 6};
        for (int valoare : valori) {
            adaugaInHeap(heap, valoare);
        }

        while (heap.size() > 0) {
            System.out.print(scoateDinHeap(heap) + " ");
        }
        System.out.println();
    }
}
```

Rezultat **1 3 5 6 8 9**

Asta este **heap sort**. O adăugare sau o scoatere parcurge cel mult un drum de sus până jos, iar un heap e cât de scund poate fi un arbore cu atâtea noduri, așa că rămâne rapid chiar și cu milioane de valori

---

Și Java are un heap: **PriorityQueue** din **java.util** este un min-heap, cu **add** pentru adăugare și **poll** pentru scoatere. Face ce fac cele două metode ale tale. În programele tale l-ai folosi pe el; aici îl construiești, ca să vezi cum merge pe dinăuntru

---

## Misiune: Folosește un heap

1. Începe **main** cu două variabile: **valori**, un tablou de `int`, și **extrageri**, un `int`. De exemplu `int[] valori = {5, 3, 8, 1, 9, 6};` și `int extrageri = 2;`
2. Scrie o metodă care adaugă o valoare într-un min-heap ținut într-o listă, urcând-o, și o metodă care scoate cea mai mică valoare, coborând-o pe ultima
3. Pornind de la o listă goală, adaugă valorile una câte una, în ordinea din tablou, și afișează **Heap:** și valorile din listă, în ordine
4. Scoate de **extrageri** ori și afișează **Extrase:** și valorile scoase, în ordinea în care le-ai scos
5. Afișează **Ramase:** și valorile rămase în listă, în ordine

Folosește metodele tale, nu **PriorityQueue** și nu sortare

**valori** are între 2 și 7 numere, toate diferite, fiecare de la -1000 la 1000. **extrageri** este cel puțin 1 și mai mic decât numărul de valori

**Exemplu** pentru valori = {5, 3, 8, 1, 9, 6} și extrageri = 2

```text
Heap: 1 3 6 5 9 8
Extrase: 1 3
Ramase: 5 8 6 9
```

**Exemplu** pentru valori = {40, 30, 20, 10} și extrageri = 1

```text
Heap: 10 20 30 40
Extrase: 10
Ramase: 20 40 30
```
