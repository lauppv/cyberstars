Ca să găsești o valoare într-un arbore din cele de până acum, trebuie să te uiți la fiecare nod: poate fi oriunde. Un **arbore binar de căutare** își ține valorile într-o ordine care îți spune încotro s-o iei, așa că o căutare sare peste părți întregi ale arborelui fără să se uite la ele

---

Regula privește fiecare nod, nu doar rădăcina: tot ce e în partea lui **stângă** este **mai mic** decât el, iar tot ce e în partea lui **dreaptă** este **mai mare**

Arborele din lecțiile trecute o respectă

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

- În stânga lui **8** sunt 3, 1 și 6, toate mai mici. În dreapta lui sunt 10 și 14, ambele mai mari
- În stânga lui **3** e 1, mai mic. În dreapta lui e 6, mai mare, și totuși mai mic decât 8, fiindcă stă în partea stângă a lui 8
- În dreapta lui **10** e 14, mai mare

De aceea parcurgerea în inordine l-a afișat sortat: inordinea afișează tot ce e mai mic decât un nod, apoi nodul, apoi tot ce e mai mare

În lecția asta valorile dintr-un arbore sunt toate diferite, așa că regula nu trebuie să spună niciodată unde merge o valoare egală

---

**Căutarea** urmează un singur drum în jos. La fiecare nod, compară valoarea căutată cu a nodului. Egală: ai găsit-o. Mai mică: poate fi doar în partea stângă. Mai mare: doar în partea dreaptă. Dacă drumul se termină, la **null**, valoarea nu e în arbore

Căutăm **6**

```visual
{"use": "bst-search-6"}
```

Căutăm **12**

```visual
{"use": "bst-search-12"}
```

Trei noduri văzute, din șase. Fiecare pas în jos lasă în urmă o parte întreagă a arborelui

Ca metodă recursivă, sunt aceleași trei întrebări, plus cazul de bază pentru un drum care s-a terminat

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
    static boolean cauta(Nod nod, int cautat) {
        if (nod == null) {
            return false;
        }
        if (cautat == nod.valoare) {
            return true;
        }
        if (cautat < nod.valoare) {
            return cauta(nod.stanga, cautat);
        }
        return cauta(nod.dreapta, cautat);
    }

    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        System.out.println(cauta(radacina, 6));
        System.out.println(cauta(radacina, 12));
    }
}
```

Rezultat

```text
true
false
```

---

**Inserarea** merge pe același drum pe care ar merge o căutare. Acolo unde se termină drumul, la **null**, e exact locul noii valori, așa că acolo se pune nodul ei

```text
static Nod insereaza(Nod nod, int valoare) {
    if (nod == null) {
        return new Nod(valoare);
    }
    if (valoare < nod.valoare) {
        nod.stanga = insereaza(nod.stanga, valoare);
    } else {
        nod.dreapta = insereaza(nod.dreapta, valoare);
    }
    return nod;
}
```

**insereaza** întoarce nodul pe care a fost apelată, cu noua valoare undeva sub el. Doar jos de tot, unde a fost apelată pe **null**, întoarce un nod nou-nouț, iar părintele de deasupra îl păstrează în **stanga** sau în **dreapta**

Un arbore gol este **null**, iar inserarea în el creează rădăcina. Iată arborele din lecție crescând din valorile 8, 3, 10, 1, 6 și 14, inserate în ordinea asta

```visual
{"use": "bst-insert"}
```

Totul la un loc, cu o parcurgere în inordine ca să-l citim înapoi

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
    static Nod insereaza(Nod nod, int valoare) {
        if (nod == null) {
            return new Nod(valoare);
        }
        if (valoare < nod.valoare) {
            nod.stanga = insereaza(nod.stanga, valoare);
        } else {
            nod.dreapta = insereaza(nod.dreapta, valoare);
        }
        return nod;
    }

    static void inordine(Nod nod) {
        if (nod == null) {
            return;
        }
        inordine(nod.stanga);
        System.out.print(nod.valoare + " ");
        inordine(nod.dreapta);
    }

    public static void main(String[] args) {
        int[] valori = {8, 3, 10, 1, 6, 14};
        Nod radacina = null;
        for (int valoare : valori) {
            radacina = insereaza(radacina, valoare);
        }

        inordine(radacina);
        System.out.println();
    }
}
```

Rezultat **1 3 6 8 10 14**

Valorile au intrat amestecate și au ieșit sortate. Un arbore binar de căutare e încă un fel de a sorta

---

Ordinea în care intră valorile hotărăște forma arborelui. Inserează aceleași cinci valori în două ordini

```text
3, 1, 4, 2, 5              1, 2, 3, 4, 5

      3                    1
     / \                    \
    1   4                    2
     \   \                    \
      2   5                    3
                                \
                                 4
                                  \
                                   5
```

În stânga, un arbore de înălțime 2. În dreapta, intrarea sortată a făcut ca fiecare valoare să fie mai mare decât precedenta, așa că fiecare a mers la dreapta, iar arborele e o linie de înălțime 4. O căutare a lui 5 acolo trece prin fiecare nod, deloc mai repede decât prin parcurgerea unui tablou

Înălțimea este costul unei căutări: câte un nod văzut pe fiecare nivel. Așa că un arbore e rapid doar cât rămâne stufos și scund. Există arbori binari de căutare care se reechilibrează singuri pe măsură ce intră valori, ca să nu devină niciodată o linie, ca arborele **AVL** și arborele **roșu-negru**; **TreeMap** din Java este un arbore roșu-negru, iar toți se bazează pe ce ai văzut în lecția asta

---

## Misiune: Crește un arbore de căutare

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu două variabile: **valori**, un tablou de `int`, și **cautat**, un `int`. De exemplu `int[] valori = {50, 30, 70, 20, 40, 60, 80};` și `int cautat = 60;`
3. Pornind de la un arbore gol, inserează valorile într-un arbore binar de căutare una câte una, în ordinea din tablou
4. Apoi, cu metode recursive, afișează trei linii
   - **Sortat:** și valorile arborelui, dintr-o parcurgere în inordine
   - **Inaltime:** și înălțimea arborelui
   - **Cautare**, valoarea căutată, două puncte și **gasit** dacă valoarea e în arbore, sau **negasit** dacă nu e. Găsește-o căutând în arbore, nu în tablou

**valori** are între 1 și 7 numere, toate diferite, iar fiecare număr, inclusiv cel căutat, este de la -1000 la 1000

**Exemplu** pentru valori = {50, 30, 70, 20, 40, 60, 80} și cautat = 60

```text
Sortat: 20 30 40 50 60 70 80
Inaltime: 2
Cautare 60: gasit
```

**Exemplu** pentru valori = {1, 2, 3, 4, 5} și cautat = 6

```text
Sortat: 1 2 3 4 5
Inaltime: 4
Cautare 6: negasit
```
