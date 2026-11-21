`int`, `double`, `boolean` și `char` nu sunt obiecte. Sunt valori simple, ceea ce le face rapide. Dar unele părți din Java merg doar cu obiecte, ca `ArrayList`. Pentru asta, fiecare tip simplu are o **clasă wrapper**: un obiect care ține o valoare

---

Perechile:

- `int` → `Integer`
- `double` → `Double`
- `boolean` → `Boolean`
- `char` → `Character`

Pe două le-ai folosit deja. `ArrayList<Integer>` e o listă de obiecte Integer, fiindcă `ArrayList<int>` nu e permis. Iar `Character.isDigit` vine din clasa Character

---

Java trece singur între cele două forme. Când pui un `int` acolo unde trebuie un `Integer`, se numește **autoboxing**. Când scoți înapoi `int`-ul, e **unboxing**

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> scoruri = new ArrayList<>();
        scoruri.add(40);
        scoruri.add(15);

        int primul = scoruri.get(0);
        int suma = scoruri.get(0) + scoruri.get(1);
        System.out.println(primul);
        System.out.println(suma);
    }
}
```

Ieșire

```text
40
55
```

`scoruri.add(40)` împachetează 40 într-un Integer. `int primul = scoruri.get(0)` îl despachetează. N-a trebuit să scrii nimic din toate astea

---

Clasele wrapper țin și ajutoare și constante utile

```java
public class Main {
    public static void main(String[] args) {
        int n = Integer.parseInt("250");
        double d = Double.parseDouble("2.5");
        System.out.println(n + 1);
        System.out.println(d * 2);
        System.out.println(Integer.MAX_VALUE);
        System.out.println(Integer.MIN_VALUE);
    }
}
```

Ieșire

```text
251
5.0
2147483647
-2147483648
```

`Integer.MAX_VALUE` e cel mai mare număr pe care îl poate ține un `int`. E o valoare de pornire bună când cauți cel mai mic număr dintr-o listă: orice găsești e mai mic sau egal

---

Două capcane. Prima, un wrapper poate fi `null`, un tip simplu nu. Despachetarea unui `null` se oprește cu un `NullPointerException`

A doua, `==` pe două obiecte Integer întreabă dacă sunt același obiect, nu dacă numerele se potrivesc. Pentru numere mici Java refolosește aceleași obiecte, așa că `==` pare să meargă, iar apoi dă greș la cele mari

```java
public class Main {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 100;
        Integer c = 1000;
        Integer d = 1000;
        System.out.println(a == b);
        System.out.println(c == d);
        System.out.println(c.equals(d));
    }
}
```

Ieșire

```text
true
false
true
```

Aceeași regulă ca la String-uri: compară obiectele wrapper cu `equals`

---

## Misiune: Obiecte pierdute

Poliția din Vice City a tastat o listă de numere de dulapuri, dar unele intrări s-au amestecat cu cuvinte. Stochează intrările într-un array de `String` numit `intrari`.

Pentru fiecare intrare care e un număr întreg, adaug-o într-un `ArrayList<Integer>`. Intrările care nu sunt numere sunt greșite. Folosește `Integer.parseInt` și prinde eroarea pe care o aruncă la o intrare greșită. Apoi afișează:

1. `Numere: [...]`, lista cum o afișează ArrayList
2. `Gresite: N`, câte intrări nu erau numere
3. `Cel mai mic: N`, cel mai mic număr, sau `Cel mai mic: niciunul` când nu există numere. Pornește căutarea de la `Integer.MAX_VALUE`

**Exemplu** pentru `intrari = { "42", "caseta", "-7", "300" }`

```text
Numere: [42, -7, 300]
Gresite: 1
Cel mai mic: -7
```

**Exemplu** pentru `intrari = { "abc", "" }`

```text
Numere: []
Gresite: 2
Cel mai mic: niciunul
```
