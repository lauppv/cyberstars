În Python ai `None` — valoarea care înseamnă „nimic." Java are propria sa versiune: `null`. Înseamnă că o variabilă de referință nu indică spre niciun obiect. Și dacă nu ești atent, îți va prăbuși programul cu una dintre cele mai faimoase erori din toată programarea

---

## Ce Este null?

Când declari o variabilă de referință fără să-i dai o valoare, ea ia implicit valoarea `null`:

```java
public class Main {
    public static void main(String[] args) {
        String nume = null;
        System.out.println(nume);
    }
}
```

Output

```text
null
```

`null` nu este un șir, nu este zero, nu este un șir gol. Este literalmente **nimic** — variabila există, dar nu indică nicăieri

---

## Temutul NullPointerException

Încearcă să apelezi o metodă pe `null` și Java intră în panică:

```java
public class Main {
    public static void main(String[] args) {
        String nume = null;
        System.out.println(nume.length());  // CRASH!
    }
}
```

Output

```text
Exception in thread "main" java.lang.NullPointerException
```

Asta este un **NullPointerException** (NPE pe scurt). Este cea mai frecventă eroare la rulare în Java. Tommy Vercetti a prăbușit mai multe programe Java decât a avut mașini în Vice City

Problema: ai cerut `.length()` din nimic. Nu există niciun șir de măsurat, așa că Java aruncă o excepție

---

## Verificarea pentru null

Soluția este simplă — verifică înainte să folosești:

```java
public class Main {
    public static void main(String[] args) {
        String nume = null;

        if (nume != null) {
            System.out.println("Nume: " + nume);
        } else {
            System.out.println("Niciun nume setat!");
        }
    }
}
```

Output

```text
Niciun nume setat!
```

Folosește `!= null` ca să verifici dacă ceva există, și `== null` ca să verifici dacă nu există. Este un obicei pe care îl vei dezvolta în timp — gândește-te mereu „ar putea fi asta null?"

---

## null vs Șir Gol vs Zero

Acestea sunt trei lucruri complet diferite:

```java
public class Main {
    public static void main(String[] args) {
        String a = null;    // niciun obiect
        String b = "";      // un obiect — un șir gol
        String c = "hello"; // un obiect — un șir cu conținut

        System.out.println(a == null);     // true — este null
        System.out.println(b == null);     // false — este un șir gol, nu null
        System.out.println(b.length());    // 0 — gol, dar există
        System.out.println(c.length());    // 5
    }
}
```

Output

```text
true
false
0
5
```

Gândește-te așa: `null` înseamnă că nici nu ai o cutie. `""` înseamnă că ai o cutie goală. `"hello"` înseamnă că ai o cutie cu lucruri în ea

---

## null cu Obiecte

Nu doar șirurile — orice referință de obiect poate fi null:

```java
class Jucator {
    String nume;

    Jucator(String nume) {
        this.nume = nume;
    }
}

public class Main {
    public static void main(String[] args) {
        Jucator p = null;
        // System.out.println(p.nume);  // NullPointerException!

        if (p != null) {
            System.out.println(p.nume);
        } else {
            System.out.println("Niciun jucator!");
        }
    }
}
```

Output

```text
Niciun jucator!
```

---

## Tipurile Primitive Nu Pot Fi null

Iată o distincție importantă: **tipurile primitive** (`int`, `double`, `boolean`, `char`) **nu pot** fi null. Doar tipurile de referință (obiecte, șiruri, array-uri) pot:

```java
public class Main {
    public static void main(String[] args) {
        int x = 0;           // valid — x este 0
        // int y = null;      // EROARE! Primitivele nu pot fi null
        String s = null;      // valid — s este null
        int[] arr = null;     // valid — array-urile sunt obiecte
    }
}
```

Dacă ai nevoie de un întreg care să poată fi „nimic," vei folosi **clase wrapper** (cum ar fi `Integer`) — dar asta e lecția următoare

---

## O Metodă de Salut Sigură

Un tipar frecvent este scrierea de metode care tratează null cu grație:

```java
public class Main {
    static String saluta(String nume) {
        if (nume != null) {
            return "Salut, " + nume + "!";
        } else {
            return "Salut, străine!";
        }
    }

    public static void main(String[] args) {
        System.out.println(saluta("Tommy Vercetti"));
        System.out.println(saluta(null));
        System.out.println(saluta("Phil Cassidy"));
    }
}
```

Output

```text
Salut, Tommy Vercetti!
Salut, străine!
Salut, Phil Cassidy!
```

---

## Comparație cu Python

`None` din Python este același concept:

```python
name = None
if name is not None:
    print(f"Hello, {name}!")
```

Diferența: Python îți dă un `AttributeError`, Java îți dă un `NullPointerException`. Amândouă înseamnă același lucru — ai încercat să folosești ceva ce nu există

---

## Misiune: Sistemul de Salut al Ecluzei

Scanerul ecluzei stației identifică membrii echipajului care intră după ecuson. Dar uneori cititorul de ecusoane eșuează și întoarce `null` — niciun nume detectat. Ai nevoie de un sistem de salut care tratează ambele cazuri cu grație.

Scrie o metodă statică numită `saluta` care primește un parametru `String nume`:

1. Dacă `nume` este **diferit de null**, întoarce `"Salut, Nume!"`
2. Dacă `nume` **este null**, întoarce `"Salut, străine!"`

În `main`, apelează metoda de două ori și afișează rezultatele: o dată cu `"Tommy"` și o dată cu `null`.

**Exemplu**

Cu apelurile de start, programul tău ar trebui să afișeze

```text
Salut, Tommy!
Salut, străine!
```
