Parcurgerile în adâncime se scufundă: coboară până jos pe o parte a arborelui înainte să revină pentru cealaltă. Uneori vrei invers. Întâi rădăcina, apoi tot ce e la un pas sub ea, apoi tot ce e la doi pași, așa cum ai citi arborele pe hârtie, rând cu rând. Asta este o **parcurgere pe niveluri**

---

Nodurile unui arbore stau pe **niveluri**. Rădăcina e pe nivelul **0**, copiii ei pe nivelul **1**, copiii lor pe nivelul **2**, și tot așa

```text
        8            nivelul 0
       / \
      3   10         nivelul 1
     / \    \
    1   6    14      nivelul 2
```

O parcurgere pe niveluri le vizitează de sus în jos și, pe fiecare nivel, de la stânga la dreapta

```text
8 3 10 1 6 14
```

Numărul ultimului nivel este înălțimea arborelui: aici **2**, același răspuns pe care l-a dat **inaltime** recursivă lecția trecută

---

Recursivitatea nu se potrivește aici. Un apel recursiv pe copilul stâng termină toată partea stângă înainte să-i vină rândul copilului drept, așa că **1** și **6** ar ieși înaintea lui **10**. Altceva trebuie să țină minte ce noduri așteaptă și să le dea mai departe în ordinea în care au fost găsite

Asta este o **coadă**, ca rândul de la casă. Cine vine se așază la sfârșit, cine e servit pleacă din față: primul venit, primul servit

```text
vin:      Ana, apoi Ben, apoi Cris

fata [ Ana  Ben  Cris ] spate

servit:   Ana iese prima, apoi Ben
```

---

Java are cozi gata făcute în **java.util**. **Queue** spune ce poate face o coadă, iar **ArrayDeque** este o clasă care face asta. **add** pune un element la sfârșit, **poll** îl ia pe cel din față, iar **size** și **isEmpty** îți spun câte așteaptă

```java
import java.util.ArrayDeque;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> coada = new ArrayDeque<>();
        coada.add("Ana");
        coada.add("Ben");
        coada.add("Cris");

        System.out.println(coada.poll());
        System.out.println(coada.poll());
        System.out.println(coada.size());
    }
}
```

Rezultat

```text
Ana
Ben
1
```

Între parantezele unghiulare stă tipul a ce ține coada, ca la un **ArrayList**: `Queue<String>` ține șiruri, `Queue<Nod>` va ține noduri

---

Acum parcurgerea propriu-zisă. Pune rădăcina în coadă. Apoi, cât timp coada nu e goală: ia nodul din față, afișează-l și pune-i copiii la sfârșit

```java
import java.util.ArrayDeque;
import java.util.Queue;

class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    static void parcurgerePeNiveluri(Nod radacina) {
        Queue<Nod> coada = new ArrayDeque<>();
        coada.add(radacina);
        while (!coada.isEmpty()) {
            Nod nod = coada.poll();
            System.out.print(nod.valoare + " ");
            if (nod.stanga != null) {
                coada.add(nod.stanga);
            }
            if (nod.dreapta != null) {
                coada.add(nod.dreapta);
            }
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        parcurgerePeNiveluri(radacina);
    }
}
```

Rezultat **8 3 10 1 6 14**

Iată coada după ce fiecare nod e scos și copiii lui puși în ea. Copiii se așază mereu în spatele tuturor celor care așteaptă deja, așa că un nivel întreg iese din coadă înainte să înceapă următorul

```text
scos   afisat  coada dupa
               [8]
8      8       [3, 10]
3      3       [10, 1, 6]
10     10      [1, 6, 14]
1      1       [6, 14]
6      6       [14]
14     14      []
```

Cele două linii cu **if** țin copiii lipsă departe de coadă: nu există niciun nod de scos mai târziu când copilul e **null**. Oricum, un **ArrayDeque** n-ar primi un null: **add(null)** oprește programul cu un **NullPointerException**

---

Ca să afișezi fiecare nivel pe linia lui, observă ce ține coada când începe un nivel: exact nodurile acelui nivel, și nimic altceva

```text
incepe nivelul 0    [8]
incepe nivelul 1    [3, 10]
incepe nivelul 2    [1, 6, 14]
```

Așa că numără-le întâi cu **coada.size()** și scoate exact atâtea. Copiii pe care îi pun ele așteaptă runda următoare

```java
import java.util.ArrayDeque;
import java.util.Queue;

class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    static void afiseazaNiveluri(Nod radacina) {
        Queue<Nod> coada = new ArrayDeque<>();
        coada.add(radacina);
        int nivel = 0;
        while (!coada.isEmpty()) {
            int marime = coada.size();
            System.out.print("Nivelul " + nivel + ": ");
            for (int i = 0; i < marime; i++) {
                Nod nod = coada.poll();
                System.out.print(nod.valoare + " ");
                if (nod.stanga != null) {
                    coada.add(nod.stanga);
                }
                if (nod.dreapta != null) {
                    coada.add(nod.dreapta);
                }
            }
            System.out.println();
            nivel++;
        }
    }

    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        afiseazaNiveluri(radacina);
    }
}
```

Rezultat

```text
Nivelul 0: 8
Nivelul 1: 3 10
Nivelul 2: 1 6 14
```

**marime** se citește o singură dată, înainte de buclă: în interiorul ei coada se tot schimbă, pe măsură ce copiii se așază la sfârșit

---

Mergând nivel cu nivel, parcurgerea ajunge la fiecare nod apropiat de rădăcină înaintea oricărui nod mai îndepărtat. De aceea această parcurgere, numită în general **în lățime**, revine în lecțiile despre grafuri: găsește cel mai scurt drum dintr-un loc în altul

---

## Misiune: Citește un arbore pe niveluri

Iată un arbore binar cu șapte noduri, cu o literă în locul fiecărei valori

```text
        a
       / \
      b   c
     /   / \
    d   e   f
         \
          g
```

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu cele șapte valori, câte o variabilă `int` pentru fiecare literă, de la `a` la `g`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Parcurge-l nivel cu nivel cu o coadă, scoțând nodurile cu **poll**, și afișează câte o linie pe nivel: **Nivelul**, numărul nivelului, două puncte și valorile de pe acel nivel, de la stânga la dreapta

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 și g = 7

```text
Nivelul 0: 1
Nivelul 1: 2 3
Nivelul 2: 4 5 6
Nivelul 3: 7
```

**Exemplu** pentru a = 40, b = 20, c = 60, d = 10, e = 50, f = 70 și g = 55

```text
Nivelul 0: 40
Nivelul 1: 20 60
Nivelul 2: 10 50 70
Nivelul 3: 55
```
