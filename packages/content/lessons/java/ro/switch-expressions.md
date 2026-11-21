În lecția Switch fiecare case se termina cu `break`, iar dacă uitai unul, codul „cădea” în case-ul următor. Java mai nou are un switch mai curat: case-uri cu săgeată `->` și un switch care dă înapoi o valoare

---

Întâi, săgeata. Un case cu `->` rulează doar codul lui. Nu mai cade în case-ul următor, deci nu mai ai ce break să uiți

```java
public class Main {
    public static void main(String[] args) {
        String arma = "shotgun";
        switch (arma) {
            case "pistol" -> System.out.println("Simplu dar sigur");
            case "shotgun" -> System.out.println("Devastator de aproape");
            default -> System.out.println("Arma necunoscuta");
        }
    }
}
```

Ieșire

```text
Devastator de aproape
```

---

Acum partea cea mai bună. Un switch poate da înapoi o valoare, cum face un ternar. I se spune **switch expression**. Îl pui în dreapta lui `=`, iar fiecare case spune ce valoare dă

```java
public class Main {
    public static void main(String[] args) {
        int zi = 6;
        String nume = switch (zi) {
            case 1 -> "Luni";
            case 2 -> "Marti";
            case 3 -> "Miercuri";
            case 4 -> "Joi";
            case 5 -> "Vineri";
            case 6, 7 -> "Weekend";
            default -> "Nu exista ziua asta";
        };
        System.out.println(nume);
    }
}
```

Ieșire

```text
Weekend
```

Câteva lucruri de observat:

- `case 6, 7` pune două valori într-un singur case
- tot switch-ul se termină cu punct și virgulă, fiindcă e finalul liniei `String nume = ...`
- un switch expression trebuie să dea o valoare pentru orice intrare posibilă, așa că aici are nevoie de `default`

---

Uneori un case are nevoie de mai multe linii până să știe ce valoare dă. Atunci deschizi un bloc cu `{ }` și dai valoarea cu **yield**

```java
public class Main {
    public static void main(String[] args) {
        String masina = "Cheetah";
        int viteza = switch (masina) {
            case "Infernus" -> 240;
            case "Cheetah" -> {
                System.out.println("Verific motorul...");
                yield 230;
            }
            default -> 150;
        };
        System.out.println("Viteza maxima: " + viteza);
    }
}
```

Ieșire

```text
Verific motorul...
Viteza maxima: 230
```

`yield` e ca `return`, dar pentru un singur case al unui switch: dă valoarea și iese din switch

---

## Misiune: Tarifele de taxi

Tommy are acum o firmă de taxi. Tariful pentru o cursă depinde de cartier. Stochează cartierul într-un `String` numit `cartier` și numărul de curse într-un `int` numit `curse`.

Tariful pentru o cursă este:

- `Ocean Beach` sau `Washington Beach`: 12
- `Downtown`: 15
- `Little Havana` sau `Little Haiti`: 10
- orice alt cartier: 20

Află tariful cu un switch expression. Apoi afișează tariful și totalul pentru toate cursele.

**Exemplu** pentru `cartier = "Downtown"` și `curse = 3`

```text
Tarif: 15
Total: 45
```

**Exemplu** pentru `cartier = "Little Haiti"` și `curse = 2`

```text
Tarif: 10
Total: 20
```

**Exemplu** pentru `cartier = "Starfish Island"` și `curse = 1`

```text
Tarif: 20
Total: 20
```
