Un ArrayList păstrează tot ce îi dai, chiar și același lucru de două ori. Uneori vrei invers: fiecare element o singură dată. Pentru asta, Java are **HashSet**

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> masini = new HashSet<>();
        masini.add("Infernus");
        masini.add("Cheetah");
        masini.add("Infernus");

        System.out.println(masini.size());
    }
}
```

Ieșire

```text
2
```

Am adăugat "Infernus" de două ori, dar set-ul îl păstrează o singură dată. Un set nu are niciodată duplicate

---

Metodele principale seamănă cu cele pe care le știi de la ArrayList

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> echipa = new HashSet<>();
        echipa.add("Tommy");
        echipa.add("Lance");
        echipa.add("Phil");

        // contains: e în set?
        System.out.println(echipa.contains("Lance"));
        System.out.println(echipa.contains("Sonny"));

        // remove: îl scoate
        echipa.remove("Phil");
        System.out.println(echipa.size());
    }
}
```

Ieșire

```text
true
false
2
```

`contains` e motivul principal pentru care folosești un set. Pe un ArrayList lung, Java verifică elementele unul câte unul. Un HashSet găsește răspunsul aproape imediat, oricât de mare ar fi

---

Mai e un truc. `add` întoarce un boolean: `true` dacă elementul era nou, `false` dacă era deja acolo

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> vazuti = new HashSet<>();
        System.out.println(vazuti.add("Diaz"));   // nou
        System.out.println(vazuti.add("Diaz"));   // era deja
    }
}
```

Ieșire

```text
true
false
```

Așa că un singur apel adaugă elementul și îți spune dacă l-ai mai văzut

---

Un HashSet nu are ordine. Dacă îl afișezi sau îl parcurgi, elementele pot ieși în orice ordine. Nu te baza niciodată pe ea

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        String[] apeluri = {"Lance", "Tommy", "Lance", "Kent", "Tommy"};
        HashSet<String> apelanti = new HashSet<>();

        for (String nume : apeluri) {
            if (apelanti.add(nume)) {
                System.out.println("Primul apel de la " + nume);
            }
        }
        System.out.println("Apelanți diferiți: " + apelanti.size());
    }
}
```

Ieșire

```text
Primul apel de la Lance
Primul apel de la Tommy
Primul apel de la Kent
Apelanți diferiți: 3
```

Aici ordinea e bună, pentru că afișăm în timp ce parcurgem array-ul, nu set-ul

---

## Misiune: Lista de Invitați

Diseară Lance stă la ușa clubului Malibu. Notează fiecare nume care intră. Unii ies la aer și se întorc, așa că numele lor apare din nou. Tommy vrea să știe cine e nou și cine e deja înăuntru

Numele sunt într-un array `String[] intrari`, în ordinea în care au intrat oamenii. Parcurge-le. Prima dată când apare un nume, afișează `Invitat nou: nume`. Când apare din nou, afișează `Deja înăuntru: nume`. La final afișează `Invitați diferiți: ` și câți oameni diferiți au venit

**Exemplu**

```text
Invitat nou: Tommy
Invitat nou: Lance
Deja înăuntru: Tommy
Invitat nou: Mercedes
Deja înăuntru: Lance
Invitat nou: Phil
Invitați diferiți: 4
```

**Exemplu**

```text
Invitat nou: Kent
Deja înăuntru: Kent
Deja înăuntru: Kent
Invitați diferiți: 1
```
