În Python, sortarea unei liste e la fel de simplă ca `my_list.sort()`. Java are ceva foarte asemănător pentru ArrayList-uri: **Collections.sort()**

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> nume = new ArrayList<>();
        nume.add("Tommy");
        nume.add("Cortez");
        nume.add("Lance");

        Collections.sort(nume);

        for (String n : nume) {
            System.out.println(n);
        }
    }
}
```

Output

```text
Cortez
Lance
Tommy
```

**Collections.sort()** sortează lista **pe loc** (in place) — modifică direct lista originală, exact ca `.sort()` din Python. Pentru string-uri, sortează **alfabetic** (A-Z). Pentru numere, sortează **de la cel mai mic la cel mai mare**

---

Trebuie să **imporți** `java.util.Collections` la începutul fișierului (atenție: `Collections` cu **s** — e diferit de `Collection`). Aceasta este o clasă utilitară plină de metode practice pentru lucrul cu liste

Hai să sortăm niște numere

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<>();
        scoruri.add(88);
        scoruri.add(42);
        scoruri.add(95);
        scoruri.add(67);

        Collections.sort(scoruri);

        for (int s : scoruri) {
            System.out.println(s);
        }
    }
}
```

Output

```text
42
67
88
95
```

---

Vrei să sortezi în ordine **inversă**? Folosește **Collections.reverse()** după sortare — întoarce lista pe dos

```java
import java.util.ArrayList;
import java.util.Collections;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<>();
        scoruri.add(88);
        scoruri.add(42);
        scoruri.add(95);
        scoruri.add(67);

        Collections.sort(scoruri);
        Collections.reverse(scoruri);

        for (int s : scoruri) {
            System.out.println(s);
        }
    }
}
```

Output

```text
95
88
67
42
```

Acum scorurile merg de la cel mai mare la cel mai mic. Gândește-te la el ca la un clasament din Vice City — primul e jucătorul de top

---

**Collections.reverse()** nu sortează — doar **întoarce** orice ordine ar avea lista. Deci dacă apelezi reverse fără să sortezi întâi, obții pur și simplu lista originală întoarsă invers

```java
public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipaj = new ArrayList<>();
        echipaj.add("Tommy");
        echipaj.add("Lance");
        echipaj.add("Phil");

        Collections.reverse(echipaj);
        // Acum este: Phil, Lance, Tommy (ordinea de inserare inversată, NU sortată)
    }
}
```

Ca să obții ordinea alfabetică inversă, trebuie să **sortezi întâi, apoi să întorci**

---

Iată o comparație rapidă cu Python

```python
# Python
nume = ["Cortez", "Tommy", "Lance"]
nume.sort()           # sortează pe loc
nume.reverse()        # întoarce pe loc
```

```java
public class Main {
    public static void main(String[] args) {
        // Java
        ArrayList<String> nume = new ArrayList<>();
        nume.add("Cortez");
        nume.add("Tommy");
        nume.add("Lance");
        Collections.sort(nume);       // sortează pe loc
        Collections.reverse(nume);    // întoarce pe loc
    }
}
```

Destul de asemănătoare, nu? Diferența principală este că Java folosește o clasă utilitară separată **Collections** în loc de metode direct pe listă

---

## Misiune: Apelul Echipajului

Căpitanul vrea ca lista echipajului să fie afișată în **ordine alfabetică**. Numele sunt deja încărcate într-un `ArrayList<String>` în dreapta. Sortează-le cu `Collections.sort()`, apoi afișează fiecare nume pe linia lui.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- Nume: `"Cortez"`, `"Tommy"`, `"Lance"`, `"Phil"`

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Cortez
Lance
Phil
Tommy
```
