Un **HashMap** este o structură care stochează perechi **cheie-valoare**. Gândește-te la el ca la lista de contacte a lui Tommy — fiecare nume (cheia) mapează la un număr de telefon (valoarea). Cauți numele, primești numărul

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

Ieșire

```text
555-0001
555-0002
```

**HashMap\<String, String\>** — primul tip este pentru chei, al doilea pentru valori. Poți amesteca: **HashMap\<String, Integer\>** are chei String și valori numerice. La fel ca la ArrayList, folosești **Integer** în loc de **int**, **Double** în loc de **double**

---

Principalele metode

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scoruri = new HashMap<String, Integer>();

        // put -- adauga sau actualizeaza o pereche
        scoruri.put("Tommy", 9500);
        scoruri.put("Lance", 7200);
        scoruri.put("Tommy", 10000);  // actualizeaza scorul lui Tommy

        // get -- valoarea pentru o cheie (null daca nu exista)
        System.out.println("Tommy: " + scoruri.get("Tommy"));
        System.out.println("Sonny: " + scoruri.get("Sonny"));

        // containsKey -- verifica daca o cheie exista
        System.out.println(scoruri.containsKey("Lance"));

        // size -- cate perechi
        System.out.println("Total: " + scoruri.size());
    }
}
```

Ieșire

```text
Tommy: 10000
Sonny: null
true
Total: 2
```

`put` cu aceeași cheie nu adaugă un duplicat — **actualizează** valoarea existentă

---

**Parcurgere cu keySet()** — obții toate cheile și le parcurgi cu for-each

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scoruri = new HashMap<String, Integer>();
        scoruri.put("Tommy", 9500);
        scoruri.put("Lance", 7200);
        scoruri.put("Phil", 3100);

        for (String nume : scoruri.keySet()) {
            System.out.println(nume + ": " + scoruri.get(nume));
        }
    }
}
```

Output (ordinea poate varia — HashMap nu garantează ordinea)

```text
Tommy: 9500
Phil: 3100
Lance: 7200
```

Citește `for (String nume : scoruri.keySet())` ca: „pentru fiecare cheie din map"

---

**Parcurgere cu entrySet()** — când vrei cheia și valoarea direct, fără un apel extra la `.get()`

```java
import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> scoruri = new HashMap<String, Integer>();
        scoruri.put("Tommy", 9500);
        scoruri.put("Lance", 7200);
        scoruri.put("Phil", 3100);

        for (Map.Entry<String, Integer> intrare : scoruri.entrySet()) {
            System.out.println(intrare.getKey() + " -> " + intrare.getValue());
        }
    }
}
```

`Map.Entry<String, Integer>` ține o pereche cheie-valoare. `.getKey()` returnează cheia, `.getValue()` returnează valoarea

---

Hai să filtrăm — Sonny Forelli vrea să afle cine îi datorează mai mult de $5000

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> datorii = new HashMap<String, Integer>();
        datorii.put("Tommy", 10000);
        datorii.put("Lance", 3000);
        datorii.put("Phil", 7500);
        datorii.put("Cortez", 500);

        for (String nume : datorii.keySet()) {
            if (datorii.get(nume) > 5000) {
                System.out.println(nume + " datoreaza $" + datorii.get(nume));
            }
        }
    }
}
```

Afișează doar Tommy și Phil — ei datorează mai mult de $5000

---

HashMap **nu** garantează ordinea. Dacă adaugi Tommy, Lance, Phil, la parcurgere ar putea ieși în orice ordine. Nu te baza pe ordinea de inserare

---

## Misiune: Registrul Misiunilor

Cortez ține evidența câte misiuni a completat fiecare membru al echipajului. Tommy a completat 47, Lance 12, Phil 8 și Mercedes 23. Cortez vrea un raport doar cu cei care au completat mai mult de 15 misiuni

Construiește un HashMap care mapează numele fiecărui membru la numărul de misiuni. Parcurge map-ul și afișează doar membrii care depășesc pragul, în formatul `nume: numar`

**Exemplu** (ordinea poate varia)

```text
Tommy: 47
Mercedes: 23
```
