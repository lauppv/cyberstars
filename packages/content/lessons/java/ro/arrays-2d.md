Un array ține un rând de valori. Dar multe lucruri sunt un tabel: o tablă de șah, etajele și camerele unei clădiri, locurile dintr-un cinema. Pentru un tabel, Java are **array-ul 2D**: un array ale cărui elemente sunt array-uri

---

Scrii două perechi de paranteze pătrate. Fiecare `{ }` din interior e un rând

```java
public class Main {
    public static void main(String[] args) {
        int[][] grila = {
            { 1, 2, 3 },
            { 4, 5, 6 }
        };
        System.out.println(grila[0][2]);
        System.out.println(grila[1][0]);
    }
}
```

Ieșire

```text
3
4
```

`grila[1][0]` înseamnă rândul 1, apoi coloana 0 din el. Amândouă se numără de la 0, deci acesta e primul număr din al doilea rând

---

Cât e de mare? `grila.length` e numărul de rânduri. `grila[0].length` e numărul de coloane din rândul 0

```java
public class Main {
    public static void main(String[] args) {
        int[][] grila = new int[3][4];
        System.out.println(grila.length);
        System.out.println(grila[0].length);
        System.out.println(grila[2][3]);
    }
}
```

Ieșire

```text
3
4
0
```

`new int[3][4]` face 3 rânduri a câte 4 numere, toate pornind de la 0

---

Ca să treci prin fiecare celulă, pui o buclă în altă buclă: cea din afară merge pe rânduri, cea din interior pe coloanele acelui rând

```java
public class Main {
    public static void main(String[] args) {
        int[][] locuri = {
            { 1, 0, 1 },
            { 0, 0, 1 },
            { 1, 1, 1 }
        };
        for (int rand = 0; rand < locuri.length; rand++) {
            int ocupate = 0;
            for (int col = 0; col < locuri[rand].length; col++) {
                ocupate += locuri[rand][col];
            }
            System.out.println("Randul " + rand + ": " + ocupate + " ocupate");
        }
    }
}
```

Ieșire

```text
Randul 0: 2 ocupate
Randul 1: 1 ocupate
Randul 2: 3 ocupate
```

Folosește `locuri[rand].length` în bucla din interior, nu un număr fix. Așa codul merge pentru un tabel de orice mărime

---

Rândurile nici nu trebuie să aibă aceeași lungime, fiindcă fiecare rând e un array separat

```java
public class Main {
    public static void main(String[] args) {
        String[][] echipe = {
            { "Tommy", "Lance" },
            { "Ken" },
            { "Sonny", "Diaz", "Avery" }
        };
        for (String[] echipa : echipe) {
            System.out.println(echipa.length + " oameni, primul e " + echipa[0]);
        }
    }
}
```

Ieșire

```text
2 oameni, primul e Tommy
1 oameni, primul e Ken
3 oameni, primul e Sonny
```

Și for-each merge aici: fiecare pas îți dă un rând întreg

---

## Misiune: Seiful

Tommy a făcut rost de harta seifului băncii. E un array 2D cu câți bani sunt în fiecare casetă: un rând pentru fiecare etaj, un număr pentru fiecare casetă. Stochează-l într-un `int[][]` numit `seif`.

1. Pentru fiecare etaj, afișează `Etajul N: total`, cu etajele numărate de la 1
2. Apoi afișează cea mai bogată casetă ca `Cea mai buna caseta: etajul E, caseta C, bani B`, cu etajele și casetele numărate de la 1. Dacă două casete au aceeași sumă, păstreaz-o pe prima întâlnită, mergând etaj cu etaj de la începutul array-ului

**Exemplu** pentru `seif = { { 100, 500, 20 }, { 0, 900, 50 } }`

```text
Etajul 1: 620
Etajul 2: 950
Cea mai buna caseta: etajul 2, caseta 2, bani 900
```

**Exemplu** pentru `seif = { { 7 } }`

```text
Etajul 1: 7
Cea mai buna caseta: etajul 1, caseta 1, bani 7
```

**Exemplu** pentru `seif = { { 5, 5 }, { 5 }, { 1, 2, 3 } }`

```text
Etajul 1: 10
Etajul 2: 5
Etajul 3: 6
Cea mai buna caseta: etajul 1, caseta 1, bani 5
```
