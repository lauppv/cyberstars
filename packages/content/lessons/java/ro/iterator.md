Des vrei să parcurgi o listă și să scoți unele elemente. Cu o buclă for-each, asta iese prost

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipa = new ArrayList<>();
        echipa.add("Turnator");
        echipa.add("Tommy");
        echipa.add("Lance");

        for (String nume : echipa) {
            if (nume.equals("Turnator")) {
                echipa.remove(nume);
            }
        }
        System.out.println(echipa);
    }
}
```

Programul se oprește cu o `ConcurrentModificationException`. Bucla for-each nu suportă ca lista să se schimbe în timp ce o parcurge

---

Soluția e un **Iterator**. E un mic ajutor care parcurge o colecție câte un element o dată și are voie să scoată elementul la care a ajuns

- `lista.iterator()`: îți dă un iterator la începutul listei
- `hasNext()`: mai există un element?
- `next()`: trece la următorul element și ți-l dă
- `remove()`: scoate elementul pe care tocmai ți l-a dat `next()`

```java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipa = new ArrayList<>();
        echipa.add("Tommy");
        echipa.add("Turnator");
        echipa.add("Lance");

        Iterator<String> it = echipa.iterator();
        while (it.hasNext()) {
            String nume = it.next();
            if (nume.equals("Turnator")) {
                it.remove();
            }
        }
        System.out.println(echipa);
    }
}
```

Ieșire

```text
[Tommy, Lance]
```

Aici `it.remove()` e sigur, pentru că iteratorul însuși face scoaterea și știe unde se află

---

Un iterator merge pe orice colecție: ArrayList, HashSet, cheile unui TreeMap. De fapt, o buclă for-each folosește un iterator în spate. Ai nevoie de unul doar când vrei să scoți elemente în timp ce parcurgi

```java
import java.util.Iterator;
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> datorii = new TreeMap<>();
        datorii.put("Kent", 0);
        datorii.put("Lance", 300);
        datorii.put("Phil", 0);

        Iterator<String> it = datorii.keySet().iterator();
        while (it.hasNext()) {
            String nume = it.next();
            if (datorii.get(nume) == 0) {
                it.remove();
            }
        }
        System.out.println(datorii);
    }
}
```

Ieșire

```text
{Lance=300}
```

Dacă scoți o cheie prin `keySet()`, o scoți și din map

---

Două reguli de ținut minte

- Apelează `next()` înainte de `remove()`. `remove()` scoate elementul primit ultima dată
- Apelează `remove()` o singură dată pentru fiecare `next()`. Un al doilea `remove()` la rând oprește programul

---

## Misiune: Oferte Proaste

Oamenii vor să cumpere afacerile lui Tommy, iar ofertele se adună. Tommy e ocupat, așa că vrea ca ofertele mici să dispară înainte să citească lista

Ofertele sunt într-un array `int[] oferte`, iar cea mai mică ofertă la care se uită Tommy e în `int minim`. Pune ofertele într-un ArrayList, în aceeași ordine. Apoi parcurge-l și scoate fiecare ofertă mai mică decât `minim`. Afișează `Pastrate: ` cu lista rămasă, apoi `Scoase: ` cu câte ai scos

**Exemplu**

```text
Pastrate: [9000, 12000, 7500]
Scoase: 3
```

**Exemplu**

```text
Pastrate: []
Scoase: 2
```
