Un stream se încheie cu un ultim pas care îți dă un rezultat. Știi deja `forEach`, `count` și `toList`. Lecția asta îți arată încă două: **collect** și **reduce**

---

`collect` strânge elementele cu un **Collector**. Colectorii gata făcuți stau în `Collectors`. `joining` lipește String-urile, cu un separator între ele

```java
import java.util.ArrayList;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipa = new ArrayList<>();
        echipa.add("Tommy");
        echipa.add("Lance");
        echipa.add("Phil");

        String rand = echipa.stream().collect(Collectors.joining(", "));
        System.out.println(rand);
    }
}
```

Ieșire

```text
Tommy, Lance, Phil
```

`Collectors.toList()` strânge într-o listă, ca `toList()`. `Collectors.toSet()` strânge într-un set

---

`groupingBy` împarte elementele în grupuri. Împreună cu `counting()`, îți spune câte elemente are fiecare grup

```java
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> arme = new ArrayList<>();
        arme.add("Pistol");
        arme.add("Uzi");
        arme.add("Pistol");

        Map<String, Long> numar = arme.stream()
            .collect(Collectors.groupingBy(a -> a, Collectors.counting()));
        System.out.println(new TreeMap<>(numar));
    }
}
```

Ieșire

```text
{Pistol=2, Uzi=1}
```

Lambda-ul `a -> a` spune după ce grupăm: aici, după arma însăși. Rezultatul e un map, pe care îl punem într-un TreeMap ca să-l afișăm sortat

---

`reduce` strânge toate elementele într-o singură valoare. Îi dai o valoare de start și un mod de a uni două valori

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> bani = new ArrayList<>();
        bani.add(500);
        bani.add(1200);
        bani.add(300);

        int total = bani.stream().reduce(0, (a, b) -> a + b);
        int maxim = bani.stream().reduce(0, Integer::max);

        System.out.println(total);
        System.out.println(maxim);
    }
}
```

Ieșire

```text
2000
1200
```

Pentru total, `reduce` pornește de la 0, apoi adună 500, apoi 1200, apoi 300. Pentru maxim, păstrează de fiecare dată valoarea mai mare dintre două

---

Pentru numere există o scurtătură. `mapToInt` transformă stream-ul într-un stream de int-uri, iar acela are `sum()`, `max()` și `average()`

```java
import java.util.ArrayList;

record Vanzare(String loc, int suma) {}

public class Main {
    public static void main(String[] args) {
        ArrayList<Vanzare> saptamana = new ArrayList<>();
        saptamana.add(new Vanzare("Malibu Club", 5000));
        saptamana.add(new Vanzare("Pole Position", 3000));

        int total = saptamana.stream().mapToInt(Vanzare::suma).sum();
        System.out.println(total);
    }
}
```

Ieșire

```text
8000
```

---

Încă un pas util înainte de un collect: `distinct()` scoate repetările, așa că fiecare element vine o singură dată

---

## Misiune: Încasările Săptămânii

În fiecare duminică, Tommy citește cât au adus afacerile lui. Vrea trei rânduri: totalul, cea mai mare vânzare și numele locurilor care au vândut ceva

Locurile sunt într-un array `String[] locuri`, iar sumele într-un array `int[] sume`. `locuri[i]` a făcut o vânzare de `sume[i]`. Există mereu cel puțin o vânzare. Pune vânzările într-o listă și folosește stream-uri ca să afișezi `Total: ` cu suma tuturor vânzărilor, `Cea mai mare: ` cu cea mai mare dintre ele și `Locuri: ` cu fiecare loc o dată, în ordine alfabetică, despărțite de o virgulă și un spațiu. Folosește `reduce` și `collect`

**Exemplu**

```text
Total: 16500
Cea mai mare: 7000
Locuri: Malibu Club, Pole Position, Print Works
```

**Exemplu**

```text
Total: 800
Cea mai mare: 800
Locuri: Kaufman Cabs
```
