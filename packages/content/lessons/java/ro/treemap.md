Un HashMap nu are ordine. Cheile lui ies cum vrea Java. Un **TreeMap** funcționează la fel, dar își ține mereu cheile sortate

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> misiuni = new TreeMap<>();
        misiuni.put("Tommy", 47);
        misiuni.put("Lance", 12);
        misiuni.put("Phil", 8);

        System.out.println(misiuni);
    }
}
```

Ieșire

```text
{Lance=12, Phil=8, Tommy=47}
```

L-am adăugat primul pe Tommy, dar TreeMap arată numele în ordine alfabetică. Numerele folosite drept chei merg de la mic la mare

---

Îl folosești ca pe un HashMap: `put`, `get`, `containsKey`, `keySet`, `entrySet`. O buclă peste el merge mereu în ordine sortată

```java
import java.util.Map;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<Integer, String> etaje = new TreeMap<>();
        etaje.put(3, "Birou");
        etaje.put(1, "Hol");
        etaje.put(2, "Studio");

        for (Map.Entry<Integer, String> e : etaje.entrySet()) {
            System.out.println(e.getKey() + ": " + e.getValue());
        }
    }
}
```

Ieșire

```text
1: Hol
2: Studio
3: Birou
```

---

Pentru că cheile sunt sortate, un TreeMap îți poate da imediat cea mai mică și cea mai mare cheie

- `firstKey()`: cea mai mică cheie
- `lastKey()`: cea mai mare cheie

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> preturi = new TreeMap<>();
        preturi.put("Stinger", 90000);
        preturi.put("Admiral", 25000);
        preturi.put("Infernus", 150000);

        System.out.println("Prima: " + preturi.firstKey());
        System.out.println("Ultima: " + preturi.lastKey());
    }
}
```

Ieșire

```text
Prima: Admiral
Ultima: Stinger
```

---

Când aduni valori pe fiecare cheie, `getOrDefault(cheie, 0)` e foarte util. Îți dă valoarea cheii, sau 0 dacă cheia nu e încă acolo

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        String[] vanzari = {"Phil", "Kent", "Phil", "Phil"};
        TreeMap<String, Integer> numar = new TreeMap<>();

        for (String nume : vanzari) {
            numar.put(nume, numar.getOrDefault(nume, 0) + 1);
        }
        System.out.println(numar);
    }
}
```

Ieșire

```text
{Kent=1, Phil=3}
```

Prima dată când îl vedem pe Phil, `getOrDefault` dă 0, deci Phil primește 1. Data următoare dă 1, deci Phil primește 2, și tot așa

---

## Misiune: Caietul lui Sonny

Sonny Forelli notează fiecare plată pe care i-o trimit oamenii lui. Aceeași persoană poate plăti de mai multe ori. Sonny vrea o pagină curată: fiecare nume o dată, cu totalul plătit, în ordine alfabetică

Numele sunt într-un array `String[] nume`, iar sumele într-un array `int[] sume`. `nume[i]` a plătit `sume[i]`. Există mereu cel puțin o plată. Afișează fiecare persoană ca `nume: total`, sortat după nume. Apoi afișează `Primul: nume` și `Ultimul: nume`, primul și ultimul nume de pe pagină

**Exemplu**

```text
Lance: 3000
Tommy: 7000
Vic: 500
Primul: Lance
Ultimul: Vic
```

**Exemplu**

```text
Kent: 1200
Primul: Kent
Ultimul: Kent
```
