Șosetele înainte de pantofi. Pereții înainte de acoperiș. Primul curs înaintea celui de-al doilea, care are nevoie de el. Multe lucrări sunt făcute din sarcini dintre care unele trebuie să le aștepte pe altele, iar întrebarea e mereu aceeași: în ce ordine le poți face pe toate, așa încât nimic să nu înceapă înainte de ce așteaptă?

---

Asta e un graf orientat. Fiecare sarcină e un nod, iar o muchie **u v** înseamnă „**u** trebuie să vină înainte de **v**”

```visual
{"use": "topo-tasks"}
```

```text
6 6
0 1
1 3
0 2
2 4
4 3
4 5
```

**3** îi așteaptă și pe **1**, și pe **4**. **0** nu așteaptă pe nimeni, așa că poate fi primul

O ordine a tuturor nodurilor în care fiecare muchie arată înainte, de la un nod la unul aflat mai târziu în listă, este o **ordine topologică**. **0 1 2 4 3 5** e una. **0 2 4 5 1 3** e alta: un graf poate avea multe. **0 1 3 2 4 5** nu e una, pentru că **3** vine înaintea lui **4**, pe care îl așteaptă

---

Câte sarcini așteaptă un nod este numărul de muchii care intră în el, **gradul lui de intrare**. Numără-l în timp ce citești muchiile: fiecare muchie **u v** adaugă unu la gradul de intrare al lui **v**

```visual
{"use": "topo-indegree"}
```

Un nod cu gradul de intrare **0** nu așteaptă pe nimeni: e gata. Fă-l, și fiecare sarcină care îl aștepta mai are de așteptat cu una mai puțin, așa că scade cu unu gradul de intrare al fiecărui nod la care duc muchiile lui. Unele ajung la **0** și devin gata la rândul lor. Continuă până când toate nodurile sunt făcute

Acesta e **algoritmul lui Kahn**. Când mai multe noduri sunt gata deodată, oricare dintre ele poate urma, și fiecare alegere dă altă ordine. Ca să obții de fiecare dată un singur răspuns, ia **cel mai mic** nod gata

```visual
{"use": "topo-kahn"}
```

Ordinea este **0 1 2 4 3 5**

---

Cu cel mult **8** noduri, cel mai mic nod gata se găsește trecând prin toate, de la **0** în sus, și oprindu-te la primul care nu e încă făcut și are gradul de intrare **0**

```java
import java.util.ArrayList;
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
        int[] grad = new int[n];
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            vecini.get(u).add(v);
            grad[v]++;
        }

        boolean[] facut = new boolean[n];
        ArrayList<Integer> ordine = new ArrayList<>();
        for (int pas = 0; pas < n; pas++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!facut[v] && grad[v] == 0) {
                    u = v;
                    break;
                }
            }
            facut[u] = true;
            ordine.add(u);
            for (int v : vecini.get(u)) {
                grad[v]--;
            }
        }

        System.out.print("ordine:");
        for (int v : ordine) {
            System.out.print(" " + v);
        }
        System.out.println();
    }
}
```

Rezultat

```text
ordine: 0 1 2 4 3 5
```

Fiecare dintre cei **n** pași ia un nod, așa că după **n** pași fiecare nod e în ordine. Cu mii de sarcini, să treci prin toate la fiecare pas devine lent, iar cele gata se țin atunci într-o coadă, sau într-un heap când cea mai mică trebuie să vină prima

---

Nu orice graf are o ordine. Să zicem că **1** îl așteaptă pe **3**, **3** pe **2**, iar **2** pe **1**

```visual
{"use": "topo-cycle"}
```

```text
4 4
0 1
1 2
2 3
3 1
```

Se așteaptă unul pe altul în cerc, un **ciclu**, așa că niciunul nu poate fi vreodată primul. După ce e făcut **0**, niciun nod nu e gata, deși trei nu sunt încă făcute

Algoritmul lui Kahn observă singur asta: când niciun nod nu e gata înainte ca toate să fie făcute, cele rămase stau pe un ciclu. În codul de mai sus, **u** rămâne **-1**. Așa că oprește-te acolo și verifică dacă ordinea are toate nodurile

```java
import java.util.ArrayList;
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
        int[] grad = new int[n];
        for (int i = 0; i < m; i++) {
            int u = scanner.nextInt();
            int v = scanner.nextInt();
            vecini.get(u).add(v);
            grad[v]++;
        }

        boolean[] facut = new boolean[n];
        ArrayList<Integer> ordine = new ArrayList<>();
        for (int pas = 0; pas < n; pas++) {
            int u = -1;
            for (int v = 0; v < n; v++) {
                if (!facut[v] && grad[v] == 0) {
                    u = v;
                    break;
                }
            }
            if (u == -1) {
                break;
            }
            facut[u] = true;
            ordine.add(u);
            for (int v : vecini.get(u)) {
                grad[v]--;
            }
        }

        System.out.print("facute:");
        for (int v : ordine) {
            System.out.print(" " + v);
        }
        System.out.println();
        System.out.println("toate facute: " + (ordine.size() == n));
    }
}
```

Rezultat

```text
facute: 0
toate facute: false
```

Așa îți spune un program de build că două părți ale unui program au nevoie una de alta, sau un spreadsheet că două celule se calculează una din alta

---

## Misiune: Planifică sarcinile

1. Citește un graf orientat: pe prima linie **n** și **m**, apoi **m** linii cu câte o muchie **u v**, adică **u** trebuie să vină înainte de **v**
2. Găsește o ordine topologică cu algoritmul lui Kahn, luând de fiecare dată cel mai mic nod gata
3. Dacă fiecare nod își primește locul, afișează **Ordine:** și ordinea
4. Dacă nu, afișează **Nicio ordine, exista un ciclu**

**n** este de la 1 la 8, iar nodurile sunt numerotate de la 0 la **n - 1**. Nicio muchie nu unește un nod cu el însuși și nicio muchie nu apare de două ori. **m** poate fi 0

**Exemplu**

Intrare

```text
5 5
3 1
1 0
4 0
2 4
3 2
```

Ieșire

```text
Ordine: 3 1 2 4 0
```

**Exemplu**

Intrare

```text
4 4
0 1
1 2
2 3
3 1
```

Ieșire

```text
Nicio ordine, exista un ciclu
```
