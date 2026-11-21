O coadă îl servește pe primul venit. O **stivă** face invers: ultimul intrat e primul ieșit. Gândește-te la lăzile din spatele unui camion. Poți lua doar lada de deasupra, pe cea pe care ai pus-o ultima

În Java, faci o stivă cu **ArrayDeque**

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> lazi = new ArrayDeque<>();
        lazi.push("Arme");
        lazi.push("Bani");
        lazi.push("Trabucuri");

        System.out.println(lazi.pop());
        System.out.println(lazi.pop());
        System.out.println(lazi);
    }
}
```

Ieșire

```text
Trabucuri
Bani
[Arme]
```

Trabucurile au intrat ultimele, așa că ies primele. `Deque` (se citește „dec”) e un rând pe care îl poți folosi de la ambele capete. Aici folosim doar un capăt, vârful, și asta îl face stivă

---

Metodele stivei

- `push(x)`: pune x deasupra
- `pop()`: ia elementul de deasupra și ți-l dă
- `peek()`: se uită la cel de deasupra, dar îl lasă acolo
- `isEmpty()` și `size()`

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<Integer> farfurii = new ArrayDeque<>();
        farfurii.push(1);
        farfurii.push(2);
        farfurii.push(3);

        System.out.println("Vârf: " + farfurii.peek());
        System.out.println(farfurii);
        System.out.println("Mărime: " + farfurii.size());
    }
}
```

Ieșire

```text
Vârf: 3
[3, 2, 1]
Mărime: 3
```

Când afișezi o stivă, vârful vine primul

---

Atenție: `pop()` pe o stivă goală oprește programul cu o `NoSuchElementException`. Verifică întâi `isEmpty()`

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> notite = new ArrayDeque<>();
        if (notite.isEmpty()) {
            System.out.println("Nu e nimic de luat");
        } else {
            System.out.println(notite.pop());
        }
    }
}
```

Ieșire

```text
Nu e nimic de luat
```

---

Stivele sunt peste tot. Butonul Undo e una: fiecare schimbare merge deasupra, iar Undo o ia înapoi pe ultima

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
    public static void main(String[] args) {
        Deque<String> schimbari = new ArrayDeque<>();
        schimbari.push("vopsesc mașina roz");
        schimbari.push("pun un eleron");
        schimbari.push("scot ușile");

        System.out.println("Undo: " + schimbari.pop());
        System.out.println("Undo: " + schimbari.pop());
        System.out.println("Ultima schimbare păstrată: " + schimbari.peek());
    }
}
```

Ieșire

```text
Undo: scot ușile
Undo: pun un eleron
Ultima schimbare păstrată: vopsesc mașina roz
```

---

## Misiune: Drumul Înapoi

Tommy se plimbă prin Vice City și ține minte locurile prin care a trecut. Când se încinge treaba, vrea să se întoarcă pe drumul pe care a venit, câte un loc o dată

Tot ce face e într-un array `String[] miscari`. Un nume de loc înseamnă că merge acolo: afișează `Merg la loc`. Cuvântul `inapoi` înseamnă că se întoarce la locul unde era înainte: afișează `Înapoi la loc`. Dacă nu există un loc înaintea celui în care e, afișează `Nu am unde să mă întorc`. La final afișează `Acum la: loc`, sau `Acum la: nicăieri` dacă n-a mers nicăieri

**Exemplu**

```text
Merg la Ocean Beach
Merg la Little Havana
Merg la Downtown
Înapoi la Little Havana
Înapoi la Ocean Beach
Nu am unde să mă întorc
Acum la: Ocean Beach
```

**Exemplu**

```text
Merg la Starfish Island
Merg la Vice Point
Înapoi la Starfish Island
Merg la Prawn Island
Acum la: Prawn Island
```
