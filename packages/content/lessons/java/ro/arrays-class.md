Afișarea unui array, sortarea lui, copierea lui: ai putea scrie câte o buclă pentru fiecare. Nu e nevoie. Java are clasa **Arrays**, plină de ajutoare pentru array-uri. Ca s-o folosești, pune `import java.util.Arrays;` chiar la începutul fișierului

---

Întâi, afișarea. `System.out.println(array)` afișează ceva ciudat, ca `[I@1b6d3586`, locul array-ului în memorie. `Arrays.toString` afișează ce e înăuntru

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scoruri = { 40, 10, 30 };
        System.out.println(Arrays.toString(scoruri));
    }
}
```

Ieșire

```text
[40, 10, 30]
```

---

Sortarea. `Arrays.sort` pune valorile în ordine, de la mic la mare, sau alfabetic pentru String-uri

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scoruri = { 40, 10, 30 };
        Arrays.sort(scoruri);
        System.out.println(Arrays.toString(scoruri));

        String[] banda = { "Lance", "Ken", "Tommy" };
        Arrays.sort(banda);
        System.out.println(Arrays.toString(banda));
    }
}
```

Ieșire

```text
[10, 30, 40]
[Ken, Lance, Tommy]
```

`Arrays.sort` schimbă array-ul pe care i-l dai. Ordinea veche s-a dus

---

Atunci cum păstrezi ordinea veche? Faci întâi o copie. `Arrays.copyOf(array, lungime)` dă înapoi un array nou cu primele `lungime` valori

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] scoruri = { 40, 10, 30 };
        int[] sortate = Arrays.copyOf(scoruri, scoruri.length);
        Arrays.sort(sortate);
        System.out.println(Arrays.toString(scoruri));
        System.out.println(Arrays.toString(sortate));

        int[] primeleDoua = Arrays.copyOf(sortate, 2);
        System.out.println(Arrays.toString(primeleDoua));
    }
}
```

Ieșire

```text
[40, 10, 30]
[10, 30, 40]
[10, 30]
```

De ce nu doar `int[] sortate = scoruri;`? Asta nu copiază nimic. Ambele nume ar arăta spre același array, iar sortarea unuia l-ar sorta și pe celălalt

---

Încă două pe care le vei întâlni:

- `Arrays.fill(array, valoare)` pune aceeași valoare în fiecare element
- `Arrays.equals(a, b)` e adevărat când ambele array-uri țin aceleași valori în aceeași ordine

```java
import java.util.Arrays;

public class Main {
    public static void main(String[] args) {
        int[] lumini = new int[4];
        Arrays.fill(lumini, 1);
        System.out.println(Arrays.toString(lumini));

        int[] a = { 1, 2 };
        int[] b = { 1, 2 };
        System.out.println(a == b);
        System.out.println(Arrays.equals(a, b));
    }
}
```

Ieșire

```text
[1, 1, 1, 1]
false
true
```

`a == b` întreabă „sunt același array?”, iar ele nu sunt, sunt două array-uri. `Arrays.equals` compară ce e înăuntru, cum face `.equals` la String-uri

---

## Misiune: Rezultatele cursei

Piloții de stradă ai lui Tommy tocmai au terminat o cursă. Stochează timpii lor, în secunde, într-un array de `int` numit `timpi`, în ordinea în care au trecut linia de start. Afișează:

1. `Ordinea de start: [...]`, timpii cum au venit
2. `Sortati: [...]`, timpii de la cel mai rapid la cel mai lent
3. `Podium: [...]`, cei trei cei mai buni timpi. Dacă sunt mai puțin de trei piloți, pe podium sunt toți

Ordinea de start trebuie să rămână cum era, chiar și după ce sortezi. Folosește clasa Arrays pentru afișare, sortare și copiere.

**Exemplu** pentru `timpi = { 61, 58, 70, 55 }`

```text
Ordinea de start: [61, 58, 70, 55]
Sortati: [55, 58, 61, 70]
Podium: [55, 58, 61]
```

**Exemplu** pentru `timpi = { 90, 80 }`

```text
Ordinea de start: [90, 80]
Sortati: [80, 90]
Podium: [80, 90]
```
