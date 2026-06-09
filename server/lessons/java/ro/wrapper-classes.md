Java are două lumi: **primitive** (`int`, `double`, `boolean`) și **obiecte** (`String`, `Player`, array-uri). De cele mai multe ori trăiesc în armonie. Dar uneori ai nevoie ca o primitivă să se comporte ca un obiect — și acolo intră în scenă **clasele wrapper**

---

## Problema

Colecțiile din Java (precum `ArrayList`) funcționează doar cu obiecte. Nu poți face asta:

```java
public class Main {
    public static void main(String[] args) {
        ArrayList<int> numere = new ArrayList<int>();  // EROARE!
    }
}
```

`int` nu este un obiect — este o primitivă. Java are nevoie de o versiune-obiect a lui `int`. Intră în scenă `Integer`:

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> numere = new ArrayList<Integer>();
        numere.add(10);
        numere.add(20);
        numere.add(30);
        System.out.println(numere);
    }
}
```

Output

```text
[10, 20, 30]
```

`Integer` este **clasa wrapper** pentru `int`. Împachetează valoarea primitivă în interiorul unui obiect

---

## Fiecare Primitivă Are un Wrapper

| Primitivă | Wrapper     |
| --------- | ----------- |
| `int`     | `Integer`   |
| `double`  | `Double`    |
| `boolean` | `Boolean`   |
| `char`    | `Character` |
| `long`    | `Long`      |
| `float`   | `Float`     |
| `byte`    | `Byte`      |
| `short`   | `Short`     |

Tiparul: scrie numele cu majusculă (iar `int` devine `Integer`, `char` devine `Character` — cele două ciudate)

---

## Autoboxing și Unboxing

Java este suficient de deșteaptă încât să convertească automat între primitive și wrappere. Asta se numește **autoboxing** (primitivă la obiect) și **unboxing** (obiect la primitivă):

```java
public class Main {
    public static void main(String[] args) {
        // Autoboxing: int -> Integer
        Integer a = 42;          // Java împachetează 42 într-un obiect Integer

        // Unboxing: Integer -> int
        int b = a;               // Java despachetează Integer înapoi la int

        System.out.println(a);   // 42
        System.out.println(b);   // 42

        // Funcționează și în expresii
        Integer x = 10;
        int rezultat = x + 5;     // x este despachetat, adunat cu 5
        System.out.println(rezultat);  // 15
    }
}
```

Output

```text
42
42
15
```

Rareori ai nevoie să te gândești la asta — Java se ocupă de conversie. Dar e bine să știi ce se întâmplă sub capotă

---

## De Ce ArrayList Are Nevoie de Wrappere

`ArrayList` stochează obiecte, nu primitive. Așa că folosești `Integer` în loc de `int`, `Double` în loc de `double`, și așa mai departe:

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<Integer>();
        scoruri.add(100);    // autoboxing: 100 -> Integer
        scoruri.add(85);
        scoruri.add(92);

        int primul = scoruri.get(0);  // unboxing: Integer -> int
        System.out.println("Primul scor: " + primul);
        System.out.println("Toate scorurile: " + scoruri);
    }
}
```

Output

```text
Primul scor: 100
Toate scorurile: [100, 85, 92]
```

---

## Metode Utile pentru Wrappere

Clasele wrapper vin cu metode utilitare la îndemână:

```java
public class Main {
    public static void main(String[] args) {
        // Convertește string-uri în numere
        int x = Integer.parseInt("42");
        double y = Double.parseDouble("3.14");
        System.out.println(x + y);

        // Obține valorile minimă/maximă
        System.out.println("Max int: " + Integer.MAX_VALUE);
        System.out.println("Min int: " + Integer.MIN_VALUE);

        // Convertește în string
        String s = Integer.toString(100);
        System.out.println("String: " + s);
    }
}
```

Output

```text
45.14
Max int: 2147483647
Min int: -2147483648
String: 100
```

`Integer.parseInt()` este deosebit de utilă — probabil ai avut nevoie să convertești un string într-un număr înainte. Așa faci asta în Java

---

## Wrapperele Pot Fi null (Atenție!)

Întrucât wrapperele sunt obiecte, ele pot fi `null` — spre deosebire de primitive:

```java
public class Main {
    public static void main(String[] args) {
        Integer a = null;    // în regulă — Integer este un obiect
        // int b = null;     // EROARE — int este o primitivă

        // Dar fii atent la despachetarea lui null:
        // int c = a;        // NullPointerException! Nu poți despacheta null
        if (a != null) {
            int c = a;
            System.out.println(c);
        } else {
            System.out.println("a is null!");
        }
    }
}
```

Output

```text
a is null!
```

Aceasta este o sursă insidioasă de bug-uri. Dacă un `Integer` este null și încerci să-l despachetezi într-un `int`, primești un `NullPointerException`. Excepția cea mai puțin preferată a lui Tommy Vercetti

---

## Comparație cu Python

Python nu are deloc această problemă — totul este deja un obiect. `42` este un obiect `int`, `3.14` este un obiect `float`. Nu există împărțirea primitivă/obiect

```python
numere = [10, 20, 30]  # pur și simplu funcționează
```

Sistemul cu două lumi al Java (primitive vs obiecte) este motivul principal pentru care există clasele wrapper. Este una dintre acele ciudățenii cu care înveți să trăiești

---

## Misiune: Inventarul Proviziilor

Inventarul depozitului de marfă este stocat într-un `ArrayList<Integer>` (pentru că colecțiile au nevoie de tipuri wrapper, nu de primitive). Adaugă cinci numere de lăzi și calculează **totalul**.

1. Creează un `ArrayList<Integer>` și adaugă: `10`, `20`, `30`, `40`, `50`
2. Parcurge lista ca să calculezi suma
3. Afișează suma

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- Numere de lăzi: `10, 20, 30, 40, 50`

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
150
```
