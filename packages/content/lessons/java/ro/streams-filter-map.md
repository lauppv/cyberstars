Cele mai multe bucle peste o listă fac aceleași câteva lucruri: păstrează unele elemente, le schimbă și fac ceva cu ce rămâne. Un **stream** te lasă să scrii acești pași unul după altul, ca o rețetă

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> vanzari = new ArrayList<>();
        vanzari.add(300);
        vanzari.add(1200);
        vanzari.add(50);
        vanzari.add(4000);

        vanzari.stream()
            .filter(v -> v > 100)
            .map(v -> v * 2)
            .forEach(v -> System.out.println(v));
    }
}
```

Ieșire

```text
600
2400
8000
```

Citește-l de sus în jos: ia vânzările, păstrează-le pe cele peste 100, dublează-le, afișează-le

---

Pașii pe care îi vei folosi cel mai des

- `filter(test)`: păstrează doar elementele pentru care lambda-ul spune `true`
- `map(schimbare)`: transformă fiecare element în altceva
- `sorted()` sau `sorted(comparator)`: pune elementele în ordine
- `forEach(actiune)`: face ceva cu fiecare element și încheie stream-ul
- `count()`: numără elementele și încheie stream-ul
- `toList()`: strânge elementele într-o listă nouă și încheie stream-ul

```java
import java.util.ArrayList;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipa = new ArrayList<>();
        echipa.add("Tommy");
        echipa.add("Lance");
        echipa.add("Phil");
        echipa.add("Mercedes");

        List<String> numeScurte = echipa.stream()
            .filter(n -> n.length() <= 5)
            .map(n -> n.toUpperCase())
            .sorted()
            .toList();
        long numeLungi = echipa.stream().filter(n -> n.length() > 5).count();

        System.out.println(numeScurte);
        System.out.println(numeLungi);
    }
}
```

Ieșire

```text
[LANCE, PHIL, TOMMY]
1
```

`count()` întoarce un `long`, un tip mai mare de număr întreg. Îl poți afișa ca pe un int

---

Un stream nu schimbă niciodată lista din care a venit. După toată munca asta, `echipa` are tot cele patru nume în ordinea veche. Și un stream se folosește o singură dată: pentru pași noi, apelează din nou `stream()`

---

Stream-urile merg foarte bine cu record-urile. `map` poate scoate un câmp din fiecare obiect

```java
import java.util.ArrayList;

record Masina(String nume, int viteza) {}

public class Main {
    public static void main(String[] args) {
        ArrayList<Masina> garaj = new ArrayList<>();
        garaj.add(new Masina("Infernus", 240));
        garaj.add(new Masina("Admiral", 150));
        garaj.add(new Masina("Cheetah", 230));

        garaj.stream()
            .filter(m -> m.viteza() > 200)
            .sorted((a, b) -> a.viteza() - b.viteza())
            .map(m -> m.nume())
            .forEach(System.out::println);
    }
}
```

Ieșire

```text
Cheetah
Infernus
```

---

## Misiune: Mașini Rapide

Diaz are nevoie de mașini rapide pentru o treabă în seara asta. Are o listă cu toate mașinile pe care le poate lua, cu viteza maximă a fiecăreia. Le vrea doar pe cele rapide, cea mai rapidă prima

Numele mașinilor sunt într-un array `String[] masini`, iar vitezele maxime într-un array `int[] viteze`. `masini[i]` are viteza maximă `viteze[i]`. Cea mai mică viteză pe care o acceptă Diaz e în `int vitezaMinima`. Pune mașinile într-o listă, apoi folosește un stream ca să păstrezi mașinile cu viteza de cel puțin `vitezaMinima`, să le sortezi de la cea mai rapidă la cea mai lentă și să afișezi fiecare ca `nume (viteza km/h)`. Dacă două mașini au aceeași viteză, păstrează ordinea din array-uri. Apoi afișează `Masini rapide: ` și câte sunt

**Exemplu**

```text
Infernus (240 km/h)
Cheetah (230 km/h)
Banshee (230 km/h)
Masini rapide: 3
```

**Exemplu**

```text
Masini rapide: 0
```
