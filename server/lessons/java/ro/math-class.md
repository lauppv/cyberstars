Java vine cu o clasă **Math** încorporată care e plină de metode utile pentru numere. Partea cea mai bună? Nu trebuie să imporți nimic — este mereu disponibilă, exact ca **System.out.println**

---

**Math.max(a, b)** — întoarce cel mai mare dintre două numere

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.max(42, 17));    // 42
        System.out.println(Math.max(-5, -20));   // -5
    }
}
```

Ca Phil Cassidy comparându-și colecția de arme: „Care e mai mare?" Math.max îți spune

---

**Math.min(a, b)** — întoarce cel mai mic dintre două numere

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.min(42, 17));    // 17
        System.out.println(Math.min(100, 200));  // 100
    }
}
```

---

**Math.abs(n)** — întoarce valoarea absolută (înlătură semnul minus)

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.abs(-99));   // 99
        System.out.println(Math.abs(50));    // 50
        System.out.println(Math.abs(0));     // 0
    }
}
```

Tommy Vercetti a pierdut 99$? Valoarea absolută a acelei pierderi este 99. Mereu pozitivă (sau zero)

---

**Math.pow(baza, exponent)** — ridică un număr la o putere. Întoarce un **double**

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.pow(2, 10));   // 1024.0
        System.out.println(Math.pow(3, 3));    // 27.0
        System.out.println(Math.pow(5, 0));    // 1.0
    }
}
```

Observă că întoarce **1024.0**, nu **1024**. Asta pentru că Math.pow întoarce mereu un **double**. Dacă vrei un int, fă cast

```java
public class Main {
    public static void main(String[] args) {
        int rezultat = (int) Math.pow(2, 10);
        System.out.println(rezultat);   // 1024
    }
}
```

**(int)** din față este un **cast** — convertește double-ul într-un int tăind partea zecimală. Am folosit acest truc în exercițiul lecției de mai jos

---

**Math.sqrt(n)** — întoarce rădăcina pătrată. Întoarce tot un double

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.sqrt(144));   // 12.0
        System.out.println(Math.sqrt(2));     // 1.4142135623730951
    }
}
```

---

**Math.random()** — întoarce un double aleator între 0.0 (inclusiv) și 1.0 (exclusiv)

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(Math.random());   // ceva de genul 0.7364281...
        System.out.println(Math.random());   // ceva diferit de fiecare dată
    }
}
```

Ca să obținem un int aleator într-un interval, să zicem de la 1 la 6 (ca o aruncare de zar)

```java
public class Main {
    public static void main(String[] args) {
        int zar = (int)(Math.random() * 6) + 1;
        System.out.println("Ai aruncat: " + zar);
    }
}
```

Cum funcționează: **Math.random() \* 6** dă un double de la 0.0 la 5.999..., **(int)** îl taie la 0-5, apoi **+ 1** îl mută la 1-6. Cortez ar aproba matematica

---

Poți și **combina** aceste metode. Vrei cel mai mare dintre două valori absolute?

```java
public class Main {
    public static void main(String[] args) {
        int a = -15;
        int b = 8;
        int rezultat = Math.max(Math.abs(a), Math.abs(b));
        System.out.println(rezultat);   // 15
    }
}
```

Java evaluează din interior spre exterior: mai întâi **Math.abs(-15) = 15** și **Math.abs(8) = 8**, apoi **Math.max(15, 8) = 15**

---

În Python, unele dintre acestea sunt funcții încorporate (**abs**, **max**, **min**, **pow**) și unele vin din modulul **math** (**math.sqrt**). În Java, sunt toate organizate frumos sub clasa **Math**

| Python              | Java           |
| ------------------- | -------------- |
| max(a, b)           | Math.max(a, b) |
| min(a, b)           | Math.min(a, b) |
| abs(n)              | Math.abs(n)    |
| pow(a, b) or a\*\*b | Math.pow(a, b) |
| math.sqrt(n)        | Math.sqrt(n)   |
| random.random()     | Math.random()  |

---

## Misiune: Calculatorul de Navigație

Calculatorul de navigație are nevoie de patru calcule rapide înainte de următorul salt. Afișează fiecare rezultat pe o **linie separată**:

1. Cel mai mare dintre `42` și `17` — folosește `Math.max`
2. Cel mai mic dintre `42` și `17` — folosește `Math.min`
3. Valoarea absolută a lui `-99` — folosește `Math.abs`
4. `2` ridicat la puterea `10` ca număr întreg — folosește `(int) Math.pow`

**Exemplu**

Programul tău ar trebui să afișeze

```text
42
17
99
1024
```
