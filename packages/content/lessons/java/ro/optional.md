Uneori o metodă nu are nimic de întors. Cauți un contact și nu există. Multe metode întorc atunci `null`, iar dacă uiți să verifici, programul se oprește cu o `NullPointerException`

Un **Optional** e o cutie care ține o valoare sau nimic. Tipul lui spune clar: „s-ar putea să nu fie nimic aici, verifică întâi”

```java
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> plina = Optional.of("Lance");
        Optional<String> goala = Optional.empty();

        System.out.println(plina.isPresent());
        System.out.println(goala.isPresent());
        System.out.println(plina.get());
    }
}
```

Ieșire

```text
true
false
Lance
```

`get()` îți dă valoarea dinăuntru. Dar pe un Optional gol oprește programul, așa că apelează-l doar după ce ai verificat

---

Varianta mai sigură: `orElse` îți dă valoarea, sau o valoare de rezervă când cutia e goală

```java
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> sofer = Optional.empty();
        System.out.println("Sofer: " + sofer.orElse("nimeni"));

        Optional<String> sef = Optional.of("Tommy");
        System.out.println("Sef: " + sef.orElse("nimeni"));
    }
}
```

Ieșire

```text
Sofer: nimeni
Sef: Tommy
```

Încă două ajutoare

- `ifPresent(actiune)`: rulează lambda-ul doar când există o valoare
- `map(schimbare)`: schimbă valoarea dinăuntru și lasă o cutie goală tot goală

```java
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        Optional<String> nume = Optional.of("phil");
        Optional<String> nimic = Optional.empty();

        nume.ifPresent(n -> System.out.println("L-am gasit pe " + n));
        System.out.println(nume.map(n -> n.toUpperCase()).orElse("-"));
        System.out.println(nimic.map(n -> n.toUpperCase()).orElse("-"));
    }
}
```

Ieșire

```text
L-am gasit pe phil
PHIL
-
```

`Optional.ofNullable(x)` face o cutie goală când `x` e null și o cutie plină altfel. E util pentru valori care pot fi null

---

Și stream-urile îți dau Optional-uri. `findFirst()` îți dă primul element rămas, iar `max(comparator)` pe cel mai mare. Stream-ul poate fi gol, așa că amândouă întorc un Optional

```java
import java.util.ArrayList;
import java.util.Optional;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> contacte = new ArrayList<>();
        contacte.add("Kent Paul");
        contacte.add("Ken Rosenberg");
        contacte.add("Lance Vance");

        Optional<String> primul = contacte.stream()
            .filter(c -> c.startsWith("Ken"))
            .findFirst();
        Optional<String> celMaiLung = contacte.stream()
            .max((a, b) -> a.length() - b.length());

        System.out.println(primul.orElse("nimeni"));
        System.out.println(celMaiLung.orElse("nimeni"));
    }
}
```

Ieșire

```text
Kent Paul
Ken Rosenberg
```

Și „Kent Paul” începe cu „Ken”, iar el vine primul în listă

---

## Misiune: Apelare Rapidă

Telefonul lui Tommy are o listă scurtă de contacte. El scrie începutul unui nume, iar telefonul trebuie să arate primul contact care începe cu ce a scris

Contactele sunt într-un array `String[] contacte`, în ordinea în care sunt salvate. Ce scrie Tommy e într-un array `String[] cautari`. Pentru fiecare căutare, găsește primul contact care începe cu ea și afișează `cautare: contact`. Dacă niciun contact nu începe cu ea, afișează `cautare: nimeni`. Folosește un stream care întoarce un Optional

**Exemplu**

```text
Ken: Kent Paul
Lan: Lance Vance
Son: nimeni
Ken R: Ken Rosenberg
```

**Exemplu**

```text
T: nimeni
```
