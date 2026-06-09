În Python, ai folosit probabil **f-string-uri** precum `f"Hello, {name}!"`. Java nu are f-string-uri, dar are ceva la fel de puternic: **String.format()**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy Vercetti";
        String mesaj = String.format("Salut, %s!", nume);
        System.out.println(mesaj);
    }
}
```

Output

```text
Salut, Tommy Vercetti!
```

**%s** este un **placeholder** (un loc rezervat) — înseamnă "pune un String aici". Când Java rulează `String.format(...)`, înlocuiește `%s` cu valoarea lui `nume`. Gândește-te la el ca la un șablon de completat unde umpli spațiile goale

---

Există placeholder-e diferite pentru tipuri diferite

- **%s** — String (sau orice altceva, de fapt — Java îl convertește în text)
- **%d** — număr întreg (int, long)
- **%f** — număr cu virgulă (double, float)

```java
public class Main {
    public static void main(String[] args) {
        String jucator = "Lance Vance";
        int eliminari = 47;
        double acuratete = 82.5;

        String statistici = String.format("Jucător: %s | Eliminări: %d | Acuratețe: %f", jucator, eliminari, acuratete);
        System.out.println(statistici);
    }
}
```

Output

```text
Jucător: Lance Vance | Eliminări: 47 | Acuratețe: 82.500000
```

Stai, sunt o grămadă de zecimale! În mod implicit, **%f** afișează 6 zecimale. Ca să controlezi asta, folosește **%.Nf** unde N este numărul de zecimale pe care le dorești

---

**%.2f** înseamnă "afișează 2 zecimale". Acesta este cel pe care îl vei folosi cel mai des

```java
public class Main {
    public static void main(String[] args) {
        double pret = 4.5;
        System.out.println(String.format("Preț: $%.2f", pret));
    }
}
```

Output

```text
Preț: $4.50
```

Poți combina placeholder-e diferite într-un singur șir de format. Ele se completează **de la stânga la dreapta**

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Cortez";
        int misiuni = 12;
        double rating = 9.7;

        String raport = String.format("%s a finalizat %d misiuni cu un rating de %.1f", nume, misiuni, rating);
        System.out.println(raport);
    }
}
```

Output

```text
Cortez a finalizat 12 misiuni cu un rating de 9.7
```

---

Java are de asemenea **printf()** care este practic o scurtătură — formatează ȘI afișează într-un singur pas, așa că nu ai nevoie de `String.format()` plus `System.out.println()` separat

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Tommy";
        int scor = 1500;
        System.out.printf("Jucător: %s | Scor: %d%n", nume, scor);
    }
}
```

Observă **%n** la final — acela este caracterul de linie nouă pentru printf. Fără el, următoarea afișare ar continua pe aceeași linie. Poți folosi și `\n`, dar `%n` este modul "corect" în Java

Compară cele două abordări

```java
public class Main {
    public static void main(String[] args) {
        // abordarea 1: String.format + println
        System.out.println(String.format("Scor: %d", 100));

        // abordarea 2: printf (mai scurt!)
        System.out.printf("Scor: %d%n", 100);
    }
}
```

Ambele produc aceeași afișare. Folosește-o pe oricare preferi — `String.format()` e grozavă când vrei să stochezi șirul formatat într-o variabilă, iar `printf()` e grozavă când vrei doar să-l afișezi imediat

---

Iată un exemplu de tablou de scor din GTA Vice City care le pune pe toate cap la cap

```java
public class Main {
    public static void main(String[] args) {
        String nume = "Phil Cassidy";
        int scor = 2300;
        double rating = 8.95;

        String linie = String.format("Jucător: %s | Scor: %d | Rating: %.2f", nume, scor, rating);
        System.out.println(linie);
    }
}
```

Output

```text
Jucător: Phil Cassidy | Scor: 2300 | Rating: 8.95
```

---

## Misiune: Afișarea Tabloului de Scor

Sala de jocuri a stației tocmai a terminat un turneu. Folosește `String.format()` cu placeholder-ele corecte (`%s`, `%d`, `%.2f`) ca să afișezi statisticile câștigătorului pe tabloul de scor.

**Input** (deja setat în partea de sus a codului tău — schimbă valorile ca să testezi):

- `nume` — numele jucătorului (String)
- `scor` — scorul total (int)
- `rating` — ratingul de performanță (double)

**Exemplu**

Cu `nume = "Tommy Vercetti"`, `scor = 1500` și `rating = 4.75`, programul tău ar trebui să afișeze

```text
Jucător: Tommy Vercetti | Scor: 1500 | Rating: 4.75
```
