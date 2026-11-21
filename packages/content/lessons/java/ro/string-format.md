Știi deja `String.format` cu `%s`, `%d` și `%.2f`. Poate mult mai mult: poate da fiecărei valori o lățime fixă, ca o listă de nume și numere să se alinieze în coloane ordonate, ca un tabel de scor adevărat

---

Pune un număr între `%` și literă, iar valoarea ocupă cel puțin atâtea caractere. Spațiile umplu restul, în stânga

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("[%5d]", 42));
        System.out.println(String.format("[%5d]", 12345));
        System.out.println(String.format("[%8s]", "Tommy"));
    }
}
```

Ieșire

```text
[   42]
[12345]
[   Tommy]
```

Parantezele pătrate sunt acolo doar ca să vezi spațiile. O valoare deja mai lată decât spațiul nu e tăiată niciodată, doar ocupă mai mult loc

---

Un semn minus împinge valoarea la stânga și pune spațiile după ea. Numele merg de obicei la stânga, numerele la dreapta

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("%-8s%4d", "Tommy", 7));
        System.out.println(String.format("%-8s%4d", "Lance", 12));
        System.out.println(String.format("%-8s%4d", "Ken", 105));
    }
}
```

Ieșire

```text
Tommy      7
Lance     12
Ken      105
```

Fiecare rând folosește aceleași lățimi, așa că coloanele se aliniază

---

Încă câteva semne utile:

- `%05d` umple cu zerouri în loc de spații: `42` devine `00042`
- `%,d` pune o virgulă între mii: `1500000` devine `1,500,000`
- `%8.2f` dă unui double 2 zecimale și o lățime de 8

```java
public class Main {
    public static void main(String[] args) {
        System.out.println(String.format("Bilet %05d", 42));
        System.out.println(String.format("Bani: %,d", 1500000));
        System.out.println(String.format("[%8.2f]", 3.14159));
    }
}
```

Ieșire

```text
Bilet 00042
Bani: 1,500,000
[    3.14]
```

---

`System.out.printf` face același lucru ca `String.format`, dar afișează pe loc. Nu adaugă singur o linie nouă, așa că închei tiparul cu `%n`

```java
public class Main {
    public static void main(String[] args) {
        String barca = "Squalo";
        int viteza = 95;
        System.out.printf("%-10s%5d km/h%n", barca, viteza);
        System.out.printf("%-10s%5d km/h%n", "Jetmax", 120);
    }
}
```

Ieșire

```text
Squalo       95 km/h
Jetmax      120 km/h
```

Folosește `String.format` când vrei să păstrezi textul într-o variabilă și `printf` când vrei doar să-l afișezi

---

## Misiune: Tabla banilor

La sfârșitul nopții Tommy vrea o tablă cu cât a adus fiecare membru al bandei. Stochează numele într-un array de `String` numit `nume` și banii într-un array de `int` numit `bani`, în aceeași ordine.

Afișează un rând pentru fiecare membru, apoi un ultim rând cu cuvântul `TOTAL` și suma. În fiecare rând:

- numele ocupă 10 caractere, la stânga
- banii ocupă 12 caractere, la dreapta, cu virgule între mii

**Exemplu** pentru `nume = { "Tommy", "Lance", "Ken" }` și `bani = { 1500000, 25000, 980 }`

```text
Tommy        1,500,000
Lance           25,000
Ken                980
TOTAL        1,525,980
```

**Exemplu** pentru `nume = { "Mercedes" }` și `bani = { 4200 }`

```text
Mercedes         4,200
TOTAL            4,200
```
