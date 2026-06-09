În Python, aveai **dicționare** — acele perechi grozave cheie-valoare unde puteai căuta o valoare după cheia ei. În Java, echivalentul este **HashMap**

Gândește-te la asta ca la lista de contacte a lui Tommy Vercetti. Fiecare nume (**cheia**) mapează la un număr de telefon (**valoarea**). Cauți numele, primești numărul. Rapid și simplu

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, String> contacte = new HashMap<String, String>();
        contacte.put("Tommy", "555-0001");
        contacte.put("Lance", "555-0002");
        contacte.put("Cortez", "555-0003");

        System.out.println(contacte.get("Tommy"));
        System.out.println(contacte.get("Lance"));
    }
}
```

Rezultat

```text
555-0001
555-0002
```

---

Să descompunem acel tip: **HashMap\<String, String\>**. Primul tip din parantezele unghiulare este **tipul cheii**, al doilea este **tipul valorii**. Așadar acest map are chei String și valori String

Poți amesteca tipurile. Vrei chei String și valori Integer? Asta e **HashMap\<String, Integer\>**

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scoruri = new HashMap<String, Integer>();
        scoruri.put("Tommy", 9500);
        scoruri.put("Lance", 7200);
        scoruri.put("Phil", 3100);

        System.out.println("Scorul lui Tommy: " + scoruri.get("Tommy"));
    }
}
```

Rezultat **Scorul lui Tommy: 9500**

La fel ca la ArrayList, nu poți folosi tipuri primitive direct — folosește **Integer** în loc de **int**, **Double** în loc de **double**, etc.

---

Principalele metode HashMap

**put(cheie, valoare)** — adaugă sau actualizează o pereche cheie-valoare

```java
public class Main {
    public static void main(String[] args) {
        scoruri.put("Tommy", 9500);     // adaugă Tommy
        scoruri.put("Tommy", 10000);    // actualizează scorul lui Tommy la 10000
    }
}
```

**get(cheie)** — obține valoarea pentru acea cheie (returnează **null** dacă cheia nu există)

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scoruri.get("Tommy"));   // 10000
        System.out.println(scoruri.get("Sonny"));   // null
    }
}
```

**containsKey(cheie)** — verifică dacă o cheie există, returnează true/false

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scoruri.containsKey("Tommy"));   // true
        System.out.println(scoruri.containsKey("Sonny"));    // false
    }
}
```

**keySet()** — returnează toate cheile (util pentru parcurgere, pe care o vom acoperi lecția următoare)

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scoruri.keySet());   // [Tommy, Lance, Phil] (ordinea poate varia)
    }
}
```

**size()** — returnează câte perechi cheie-valoare sunt în map

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(scoruri.size());   // 3
    }
}
```

---

În Python ai scrie

```python
scores = {"Tommy": 9500, "Lance": 7200, "Phil": 3100}
print(scores["Tommy"])
print("Tommy" in scores)
```

Versiunea din Java este mai stufoasă dar conceptul este identic. **put** este ca **scores["Tommy"] = 9500** din Python, iar **get** este ca **scores["Tommy"]**

---

O diferență importantă față de Python: HashMap **NU** garantează ordinea. Dacă adaugi întâi Tommy, apoi Lance, apoi Phil, când afișezi map-ul sau îl parcurgi, ar putea ieși în **orice ordine**. Nu te baza pe ordinea de inserare cu HashMap. (Dacă ai nevoie de ordine, există **LinkedHashMap**, dar vom păstra lucrurile simple pentru moment)

---

Iată un exemplu practic. Cortez ține evidența câte misiuni a completat fiecare membru al echipajului

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> misiuni = new HashMap<String, Integer>();
        misiuni.put("Tommy", 47);
        misiuni.put("Lance", 12);
        misiuni.put("Phil", 8);

        if (misiuni.containsKey("Tommy")) {
            System.out.println("Tommy a completat " + misiuni.get("Tommy") + " misiuni");
        }

        // Actualizează o valoare
        misiuni.put("Lance", misiuni.get("Lance") + 1);
        System.out.println("Lance are acum " + misiuni.get("Lance") + " misiuni");
    }
}
```

Rezultat

```text
Tommy a completat 47 misiuni
Lance are acum 13 misiuni
```

---

## Misiune: Registrul Echipajului

Baza de date de personal a stației a fost ștearsă în timpul unei erupții solare. Trebuie să reconstruiești lista echipajului din memorie înainte să înceapă următoarea tură.

Creează un **HashMap\<String, Integer\>** numit `scoruri` care mapează numele membrilor echipajului la scorurile lor de performanță. Înregistrează acești trei membri:

1. `"Tommy"` cu scorul `9500`
2. `"Lance"` cu scorul `7200`
3. `"Phil"` cu scorul `3100`

Apoi afișează fiecare membru și scorul lui pe propria linie folosind `.get()`, în formatul `Nume: scor`.

**Input** (deja setat în codul tău — schimbă valorile ca să testezi):

- `"Tommy"`, `"Lance"`, `"Phil"` — numele membrilor echipajului
- `9500`, `7200`, `3100` — scorurile lor de performanță

**Exemplu**

Cu valorile de start, programul tău ar trebui să afișeze

```text
Tommy: 9500
Lance: 7200
Phil: 3100
```
