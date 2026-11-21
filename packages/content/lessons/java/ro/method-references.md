Multe lambda-uri nu fac altceva decât să apeleze o metodă

```text
nume.forEach(n -> System.out.println(n));
```

Lambda-ul primește `n` și îl dă direct lui `println`. Java are un mod mai scurt de a spune asta: o **referință la metodă**, scrisă cu două puncte duble

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipa = new ArrayList<>();
        echipa.add("Tommy");
        echipa.add("Lance");

        echipa.forEach(System.out::println);
    }
}
```

Ieșire

```text
Tommy
Lance
```

`System.out::println` înseamnă „metoda println a lui System.out”. Nu o apelezi tu, ci o dai mai departe, iar `forEach` o apelează pentru fiecare element

---

O referință la metodă poate arăta și spre o metodă a elementului însuși. `String::toUpperCase` înseamnă „ia String-ul și apelează-i toUpperCase”

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> echipa = new ArrayList<>();
        echipa.add("tommy");
        echipa.add("lance");

        echipa.replaceAll(String::toUpperCase);
        System.out.println(echipa);
    }
}
```

Ieșire

```text
[TOMMY, LANCE]
```

`replaceAll` înlocuiește fiecare element din listă cu ce întoarce funcția. Aici, același nume cu majuscule

---

Merge și cu metode statice, ca `Integer::parseInt`, și cu metodele tale

```java
import java.util.function.Function;

public class Main {
    static int bacsis(int nota) {
        return nota / 10;
    }

    public static void main(String[] args) {
        Function<String, Integer> citeste = Integer::parseInt;
        Function<Integer, Integer> bacsisPentru = Main::bacsis;

        int nota = citeste.apply("450");
        System.out.println(bacsisPentru.apply(nota));
    }
}
```

Ieșire

```text
45
```

---

Iată lambda-urile și referințele la metode care fac același lucru

```text
n -> System.out.println(n)       System.out::println
s -> s.toUpperCase()             String::toUpperCase
s -> Integer.parseInt(s)         Integer::parseInt
(a, b) -> a.compareTo(b)         String::compareTo
nume -> new Masina(nume)         Masina::new
```

Folosește o referință la metodă când lambda-ul doar apelează o metodă. Când face mai mult, păstrează lambda-ul

---

## Misiune: Lista de Apeluri

Kent Paul îi dă lui Tommy o listă cu oameni de sunat. Kent a scris-o în grabă: unele nume au majuscule, altele nu, iar ordinea e un haos. Tommy o vrea curată

Numele sunt într-un array `String[] nume`. Pune-le într-un ArrayList. Fă fiecare nume cu majuscule, sortează lista alfabetic și afișează câte un nume pe rând. Apoi afișează `Apeluri de făcut: ` și câte nume sunt. Folosește referințe la metode, nu lambda-uri

**Exemplu**

```text
CORTEZ
KENT
LANCE
PHIL
Apeluri de făcut: 4
```

**Exemplu**

```text
Apeluri de făcut: 0
```
