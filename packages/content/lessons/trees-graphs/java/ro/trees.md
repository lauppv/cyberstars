Listele țin lucrurile în șir: un prim element, un al doilea, un al treilea. Multe din ce întâlnești zi de zi se ramifică însă. Folderele de pe calculator conțin alte foldere, care conțin la rândul lor foldere. Un arbore genealogic se desparte la fiecare generație. Tabloul unui turneu se strânge până la un singur câștigător. Toate au aceeași formă, și ea are un nume: **arbore**

---

Iată un arbore mic de numere

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

Fiecare număr este un **nod**, iar fiecare linie dintre două noduri este o **muchie**. În programare arborii cresc cu capul în jos: încep de sus

- **Rădăcina** este nodul de sus, de unde pornește arborele: **8**
- Un nod aflat imediat sub altul este **copilul** lui, iar cel de deasupra este **părintele** lui. **3** și **10** sunt copiii lui **8**, iar **8** este părintele lor
- Un nod fără copii este o **frunză**: **1**, **6** și **14**
- **Înălțimea** unui arbore este numărul de muchii de pe cel mai lung drum de la rădăcină în jos până la o frunză. Aici e 8 → 3 → 1 sau 8 → 10 → 14: două muchii, deci înălțimea este **2**. Un arbore care are doar rădăcina are înălțimea **0**

Fiecare nod în afară de rădăcină are exact un părinte, deci există un singur drum de la rădăcină în jos până la fiecare nod. Asta îl face arbore, și nu doar un ghem de linii

---

În acest arbore niciun nod nu are mai mult de doi copii. Un astfel de arbore este un **arbore binar**, iar cei doi copii au nume: copilul **stâng** și copilul **drept**. **10** are doar un copil drept, **14**; cel stâng lipsește

Arborii binari sunt cei pe care îi vei folosi cel mai des. Căutarea, sortarea și majoritatea problemelor din lecțiile următoare pornesc de la ei

---

Un nod trebuie să țină împreună trei lucruri: **valoarea** lui, copilul **stâng** și copilul **drept**. În Java asta e o clasă cu trei câmpuri

```text
class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}
```

**stanga** și **dreapta** sunt chiar de tip **Nod**: un nod își ține propriii copii. Un câmp de tipul unei clase care nu ține niciun obiect este **null**, deci un nod nou primește valoarea dată constructorului și încă niciun copil

```java
class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        System.out.println(radacina.valoare);
        System.out.println(radacina.stanga);
    }
}
```

Rezultat

```text
8
null
```

Singur, un nod nou este o valoare cu doi copii goi

```text
      8
     / \
  null null
```

---

Un copil e doar un alt nod, pus în **stanga** sau în **dreapta**. Iată cum crește arborele de la începutul lecției, câte o linie de cod

```text
Nod radacina = new Nod(8);

        8

radacina.stanga = new Nod(3);

        8
       /
      3

radacina.dreapta = new Nod(10);

        8
       / \
      3   10

radacina.stanga.stanga = new Nod(1);

        8
       / \
      3   10
     /
    1

radacina.stanga.dreapta = new Nod(6);

        8
       / \
      3   10
     / \
    1   6

radacina.dreapta.dreapta = new Nod(14);

        8
       / \
      3   10
     / \    \
    1   6    14
```

Toate la un loc, cu trei dintre noduri citite înapoi

```java
class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        System.out.println(radacina.stanga.valoare);
        System.out.println(radacina.stanga.dreapta.valoare);
        System.out.println(radacina.dreapta.dreapta.valoare);
    }
}
```

Rezultat

```text
3
6
14
```

Citește **radacina.stanga.dreapta** câte un pas: pornești de la rădăcină, mergi la copilul ei stâng, apoi la copilul drept al acestuia. Orice nod poate fi atins așa, de la rădăcină în jos pe muchii. Programul ține într-o variabilă doar **radacina**; toate celelalte noduri atârnă de ea

Adică drumul acesta prin arbore

```text
        8          radacina
       /
      3            radacina.stanga
       \
        6          radacina.stanga.dreapta
```

---

O frunză este un nod ai cărui doi copii sunt amândoi **null**

În arborele de la început, frunzele sunt cele trei noduri din paranteze

```text
        8
       / \
      3   10
     / \    \
   (1) (6)  (14)
```

```java
class Nod {
    int valoare;
    Nod stanga;
    Nod dreapta;

    Nod(int valoare) {
        this.valoare = valoare;
    }
}

public class Main {
    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        Nod frunza = radacina.stanga.stanga;
        if (frunza.stanga == null && frunza.dreapta == null) {
            System.out.println(frunza.valoare + " este o frunza");
        }
    }
}
```

Rezultat **1 este o frunza**

---

Deocamdată construiești arborii de mână, câte un nod. În lecțiile următoare vei parcurge un arbore întreg cu câteva linii de cod, oricât de mare ar fi

---

## Misiune: Construiește un arbore

Iată un arbore binar cu cinci noduri, cu o literă în locul fiecărei valori

```text
      a
     / \
    b   c
   / \
  d   e
```

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu cele cinci valori, câte o variabilă pentru fiecare literă: `int a = 8;`, `int b = 3;`, `int c = 10;`, `int d = 1;` și `int e = 6;`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Apoi, pornind de la rădăcină și mergând prin copiii ei, afișează trei linii
   - **Radacina:** și valoarea rădăcinii
   - **Copii:** și copiii rădăcinii, întâi cel stâng
   - **Frunze:** și frunzele, de la stânga la dreapta

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 8, b = 3, c = 10, d = 1 și e = 6

```text
Radacina: 8
Copii: 3 10
Frunze: 1 6 10
```

**Exemplu** pentru a = 50, b = 30, c = 70, d = 20 și e = 40

```text
Radacina: 50
Copii: 30 70
Frunze: 20 40 70
```
