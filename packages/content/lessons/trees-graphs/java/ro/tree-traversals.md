Lecția trecută ai construit un arbore de mână și i-ai citit nodurile pe câte un drum: **radacina.stanga.dreapta**. Merge pentru cinci noduri. Un arbore adevărat poate avea mii, iar forma lui nu o știi dinainte. Îți trebuie un fel de a vizita fiecare nod, oricum ar arăta arborele, în câteva linii de cod

Asta se face cu **recursivitate**, iar ea începe cu metode care se apelează pe ele însele

---

O metodă poate apela orice metodă, inclusiv pe ea însăși. O metodă care se apelează pe ea însăși este **recursivă**. Pare că n-ar trebui să se termine niciodată, și chiar așa ar fi, dacă fiecare apel n-ar lucra pe o bucată mai mică a problemei și dacă o bucată n-ar fi destul de mică pentru un răspuns pe loc. Bucata cea mai mică este **cazul de bază**: acolo metoda se întoarce fără să se mai apeleze

Numărătoare inversă de la 3

```java
public class Main {
    static void numaraInvers(int n) {
        if (n == 0) {
            System.out.println("Start!");
            return;
        }
        System.out.println(n);
        numaraInvers(n - 1);
    }

    public static void main(String[] args) {
        numaraInvers(3);
    }
}
```

Rezultat

```text
3
2
1
Start!
```

**numaraInvers(3)** afișează 3 și lasă restul treburii pe seama lui **numaraInvers(2)**, care afișează 2 și o lasă lui **numaraInvers(1)**, și tot așa până la **numaraInvers(0)**. Acesta e cazul de bază: afișează **Start!** și se întoarce, iar fiecare apel de dinaintea lui nu mai are nimic de făcut, așa că se întorc toate

---

O metodă recursivă poate și **întoarce** o valoare, construită din răspunsul apelului mai mic. Suma 1 + 2 + ... + n este n plus suma până la n - 1, iar suma până la 0 este 0

```java
public class Main {
    static int sumaPana(int n) {
        if (n == 0) {
            return 0;
        }
        return n + sumaPana(n - 1);
    }

    public static void main(String[] args) {
        System.out.println(sumaPana(4));
    }
}
```

Rezultat **10**

Fiecare apel îl așteaptă pe cel pe care l-a făcut, apoi își adaugă propriul număr

```text
sumaPana(4) = 4 + sumaPana(3)
                  sumaPana(3) = 3 + sumaPana(2)
                                    sumaPana(2) = 2 + sumaPana(1)
                                                      sumaPana(1) = 1 + sumaPana(0)
                                                                        sumaPana(0) = 0
                                                      sumaPana(1) = 1 + 0 = 1
                                    sumaPana(2) = 2 + 1 = 3
                  sumaPana(3) = 3 + 3 = 6
sumaPana(4) = 4 + 6 = 10
```

Fiecare apel care încă nu s-a întors ocupă puțină memorie, pe ceea ce Java numește **stivă**. Dacă uiți cazul de bază, sau scrii unul la care apelurile nu ajung niciodată, ele se tot adună până se umple stiva: programul se oprește cu un **StackOverflowError**. Când vezi o astfel de eroare, uită-te întâi la cazul de bază

---

Acum uită-te din nou la un arbore

```text
        8
       / \
      3   10
     / \    \
    1   6    14
```

Acoperă rădăcina cu mâna. Ce rămâne sunt doi arbori mai mici: unul care pornește de la **3**, unul care pornește de la **10**. Fiecare dintre ei e o rădăcină cu doi arbori mai mici sub ea, și tot așa, până la frunze

```text
      3        10
     / \         \
    1   6         14
```

Deci un arbore este o rădăcină plus doi arbori mai mici. Exact forma care îi place recursivității: ca să faci ceva cu un arbore, fă-o cu rădăcina și lasă aceeași metodă să se ocupe de cei doi arbori mai mici. Cazul de bază este arborele gol, **null**: acolo nu e nimic de făcut

---

Iată toată ideea în câteva linii. **arata** afișează fiecare valoare din arbore

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
    static void arata(Nod nod) {
        if (nod == null) {
            return;
        }
        System.out.println(nod.valoare);
        arata(nod.stanga);
        arata(nod.dreapta);
    }

    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        arata(radacina);
    }
}
```

Rezultat

```text
8
3
1
6
10
14
```

**arata(radacina)** afișează 8, apoi apelează **arata** pe copilul stâng, care afișează 3 și coboară din nou. Când ajunge la un copil care lipsește, **nod == null** îl trimite imediat înapoi sus, iar parcurgerea continuă de unde rămăsese. Nimic din **arata** nu știe cât de mare e arborele: aceleași linii merg pentru orice arbore

---

**arata** a făcut trei lucruri la fiecare nod: afișează nodul, parcurge partea stângă, parcurge partea dreaptă. Schimbă ordinea celor trei linii și obții altă parcurgere. Fiecare ordine are un nume, iar împreună sunt **parcurgerile în adâncime**: fiecare coboară până jos pe o parte înainte să revină pentru cealaltă

**Preordine:** întâi nodul, apoi partea lui stângă, apoi partea dreaptă

```text
static void preordine(Nod nod) {
    if (nod == null) {
        return;
    }
    System.out.print(nod.valoare + " ");
    preordine(nod.stanga);
    preordine(nod.dreapta);
}
```

Asta e parcurgerea făcută de **arata**. Numerele din paranteze arată în ce ordine e afișat fiecare nod

```text
          8 (1)
         / \
    (2) 3   10 (5)
       / \    \
  (3) 1   6    14 (6)
         (4)

Preordine: 8 3 1 6 10 14
```

**Inordine:** întâi partea stângă, apoi nodul, apoi partea dreaptă

```text
static void inordine(Nod nod) {
    if (nod == null) {
        return;
    }
    inordine(nod.stanga);
    System.out.print(nod.valoare + " ");
    inordine(nod.dreapta);
}
```

```text
          8 (4)
         / \
    (2) 3   10 (5)
       / \    \
  (1) 1   6    14 (6)
         (3)

Inordine: 1 3 6 8 10 14
```

Uită-te la linia asta: numerele au ieșit sortate. Aici nu e o întâmplare, iar lecția despre arborii binari de căutare îți va arăta de ce

**Postordine:** partea stângă, apoi partea dreaptă, iar nodul la final

```text
static void postordine(Nod nod) {
    if (nod == null) {
        return;
    }
    postordine(nod.stanga);
    postordine(nod.dreapta);
    System.out.print(nod.valoare + " ");
}
```

```text
          8 (6)
         / \
    (3) 3   10 (5)
       / \    \
  (1) 1   6    14 (4)
         (2)

Postordine: 1 6 3 14 10 8
```

Un nod e afișat abia după tot ce e sub el. E ordinea potrivită când copiii trebuie rezolvați înaintea părintelui, ca la ștergerea unui folder: întâi pleacă fișierele din el

---

Toate trei pe același arbore. **System.out.print** ține valorile pe aceeași linie, iar **System.out.println()** gol o încheie

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
    static void preordine(Nod nod) {
        if (nod == null) {
            return;
        }
        System.out.print(nod.valoare + " ");
        preordine(nod.stanga);
        preordine(nod.dreapta);
    }

    static void inordine(Nod nod) {
        if (nod == null) {
            return;
        }
        inordine(nod.stanga);
        System.out.print(nod.valoare + " ");
        inordine(nod.dreapta);
    }

    static void postordine(Nod nod) {
        if (nod == null) {
            return;
        }
        postordine(nod.stanga);
        postordine(nod.dreapta);
        System.out.print(nod.valoare + " ");
    }

    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        preordine(radacina);
        System.out.println();
        inordine(radacina);
        System.out.println();
        postordine(radacina);
        System.out.println();
    }
}
```

Rezultat

```text
8 3 1 6 10 14
1 3 6 8 10 14
1 6 3 14 10 8
```

---

O metodă recursivă poate și **întoarce** ceva despre arbore. **Înălțimea** este numărul de muchii de pe cel mai lung drum în jos de la rădăcină. Gândește recursiv: arborele este rădăcina deasupra celor doi arbori mai mici, deci înălțimea lui este cu o muchie mai mare decât a celui mai înalt dintre ei

```text
inaltime(8) = 1 + cea mai mare dintre inaltime(3) si inaltime(10)
```

Cazul de bază cere atenție. O singură frunză are înălțimea 0 și se află cu o muchie deasupra celor doi copii care îi lipsesc. Așa că un arbore gol contează ca **-1**: atunci o frunză primește 1 + (-1) = 0, cum trebuie. **Math.max** dă cel mai mare dintre două numere

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
    static int inaltime(Nod nod) {
        if (nod == null) {
            return -1;
        }
        return 1 + Math.max(inaltime(nod.stanga), inaltime(nod.dreapta));
    }

    public static void main(String[] args) {
        Nod radacina = new Nod(8);
        radacina.stanga = new Nod(3);
        radacina.dreapta = new Nod(10);
        radacina.stanga.stanga = new Nod(1);
        radacina.stanga.dreapta = new Nod(6);
        radacina.dreapta.dreapta = new Nod(14);

        System.out.println(inaltime(radacina));
        System.out.println(inaltime(radacina.dreapta));
        System.out.println(inaltime(radacina.stanga.stanga));
    }
}
```

Rezultat

```text
2
1
0
```

Urmărește-o de jos în sus, cu răspunsul fiecărui nod în paranteze. Fiecare frunză răspunde 0. **10** răspunde 1 + max(-1, 0) = 1, la fel și **3**. Rădăcina răspunde 1 + max(1, 1) = **2**

```text
          8 (2)
         / \
    (1) 3   10 (1)
       / \    \
  (0) 1   6    14 (0)
         (0)
```

---

Același tipar numără nodurile, adună valorile sau găsește valoarea cea mai mare. Hotărăște ce răspunde arborele gol, apoi construiește răspunsul unui nod din răspunsurile celor doi copii

```text
static int numara(Nod nod) {
    if (nod == null) {
        return 0;
    }
    return 1 + numara(nod.stanga) + numara(nod.dreapta);
}
```

---

## Misiune: Parcurge un arbore

Iată un arbore binar cu șapte noduri, cu o literă în locul fiecărei valori

```text
        a
       / \
      b   c
     / \   \
    d   e   f
       /
      g
```

1. Scrie clasa **Nod**, cu o valoare, un copil stâng și un copil drept
2. Începe **main** cu cele șapte valori, câte o variabilă `int` pentru fiecare literă, de la `a` la `g`
3. Construiește arborele: câte un nod pentru fiecare valoare, legate ca în desen
4. Scrie câte o metodă recursivă pentru fiecare dintre cele trei parcurgeri în adâncime și folosește-le ca să afișezi trei linii
   - **Preordine:** și valorile în preordine
   - **Inordine:** și valorile în inordine
   - **Postordine:** și valorile în postordine

Valorile sunt numere întregi de la -1000 la 1000, iar două dintre ele pot fi egale

**Exemplu** pentru a = 1, b = 2, c = 3, d = 4, e = 5, f = 6 și g = 7

```text
Preordine: 1 2 4 5 7 3 6
Inordine: 4 2 7 5 1 3 6
Postordine: 4 7 5 2 6 3 1
```

**Exemplu** pentru a = 50, b = 30, c = 70, d = 20, e = 40, f = 80 și g = 35

```text
Preordine: 50 30 20 40 35 70 80
Inordine: 20 30 35 40 50 70 80
Postordine: 20 35 40 30 80 70 50
```
