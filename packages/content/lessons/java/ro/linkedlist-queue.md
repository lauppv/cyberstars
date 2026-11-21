Gândește-te la rândul de la un service auto. Prima mașină care ajunge e prima care e reparată. În Java, un rând ca acesta e o **Queue** (coadă): primul intrat, primul ieșit

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> rand = new LinkedList<>();
        rand.offer("Infernus");
        rand.offer("Cheetah");
        rand.offer("Stinger");

        System.out.println(rand.poll());
        System.out.println(rand.poll());
        System.out.println(rand);
    }
}
```

Ieșire

```text
Infernus
Cheetah
[Stinger]
```

`Queue` spune ce face colecția: un rând. `LinkedList` e clasa care face treaba în spate. Scrii `Queue<String>` în stânga și `new LinkedList<>()` în dreapta

---

Metodele cozii

- `offer(x)`: pune x la capătul rândului
- `poll()`: îl scoate pe primul din rând și ți-l dă
- `peek()`: se uită la primul, dar îl lasă în rând
- `isEmpty()` și `size()`: e rândul gol și cât de lung e

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> apeluri = new LinkedList<>();
        apeluri.offer("Lance");
        apeluri.offer("Kent");

        System.out.println("Urmatorul: " + apeluri.peek());
        System.out.println("Asteapta: " + apeluri.size());
    }
}
```

Ieșire

```text
Urmatorul: Lance
Asteapta: 2
```

`peek` nu l-a scos pe Lance. El e tot primul în rând

---

Ce se întâmplă când rândul e gol? `poll()` și `peek()` nu se opresc cu eroare, ci întorc `null`

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> rand = new LinkedList<>();
        System.out.println(rand.poll());
        System.out.println(rand.isEmpty());
    }
}
```

Ieșire

```text
null
true
```

Așa că verifică întâi `isEmpty()`, înainte să scoți pe cineva

---

Un mod des folosit: tot scoți din față până când rândul e gol

```java
import java.util.LinkedList;
import java.util.Queue;

public class Main {
    public static void main(String[] args) {
        Queue<String> treburi = new LinkedList<>();
        treburi.offer("Il iau pe Lance");
        treburi.offer("Trec pe la Phil");
        treburi.offer("Ma vad cu Diaz");

        while (!treburi.isEmpty()) {
            System.out.println("Fac: " + treburi.poll());
        }
    }
}
```

Ieșire

```text
Fac: Il iau pe Lance
Fac: Trec pe la Phil
Fac: Ma vad cu Diaz
```

---

## Misiune: Sunshine Autos

Service-ul de la Sunshine Autos repară mașinile în ordinea în care ajung. Toată ziua se întâmplă două lucruri: intră o mașină nouă sau un mecanic se eliberează și ia următoarea mașină

Tot ce se întâmplă e într-un array `String[] evenimente`. Un nume de mașină înseamnă că mașina intră: afișează `Asteapta: nume (n la rand)`, unde n e lungimea rândului după ce a intrat. Cuvântul `urmatoarea` înseamnă că un mecanic e liber: ia prima mașină din rând și afișează `Reparata: nume`. Dacă nu așteaptă nicio mașină, afișează `Nicio masina nu asteapta`. La final afișează `Mai asteapta: ` și câte mașini au rămas la rând

**Exemplu**

```text
Asteapta: Infernus (1 la rand)
Asteapta: Cheetah (2 la rand)
Reparata: Infernus
Asteapta: Stinger (2 la rand)
Reparata: Cheetah
Reparata: Stinger
Nicio masina nu asteapta
Mai asteapta: 0
```

**Exemplu**

```text
Asteapta: Admiral (1 la rand)
Asteapta: Banshee (2 la rand)
Asteapta: PCJ 600 (3 la rand)
Reparata: Admiral
Mai asteapta: 2
```
