Recursivitatea devine mai ușoară cu exercițiu. Întrebarea pe care ți-o pui de fiecare dată e aceeași: cum e făcută problema asta dintr-o copie mai mică a ei? Hai s-o încercăm pe numere, array-uri și String-uri

---

**Puterea.** `2⁵` e `2 × 2⁴`. Iar orice la puterea 0 e 1, acesta e cazul de bază

```java
public class Main {
    static int putere(int baza, int exp) {
        if (exp == 0) {
            return 1;
        }
        return baza * putere(baza, exp - 1);
    }

    public static void main(String[] args) {
        System.out.println(putere(2, 5));
        System.out.println(putere(7, 0));
    }
}
```

Ieșire

```text
32
1
```

---

**Suma unui array.** Suma de la poziția `i` până la final e valoarea de la `i`, plus suma de la `i + 1` până la final. Când `i` trece de final, nu mai e nimic de adunat

```java
public class Main {
    static int sumaDeLa(int[] valori, int i) {
        if (i == valori.length) {
            return 0;
        }
        return valori[i] + sumaDeLa(valori, i + 1);
    }

    public static void main(String[] args) {
        int[] prada = { 50, 20, 30 };
        System.out.println(sumaDeLa(prada, 0));
    }
}
```

Ieșire

```text
100
```

Array-ul nu se micșorează aici. Ce se micșorează e partea rămasă de adunat, de la `i` la final. Să dai poziția mai departe e un truc des folosit

---

**String-uri.** Un String e primul lui char plus restul, iar `substring(1)` îți dă restul. Aici numărăm litera `a`

```java
public class Main {
    static int numaraA(String text) {
        if (text.isEmpty()) {
            return 0;
        }
        int prima = text.charAt(0) == 'a' ? 1 : 0;
        return prima + numaraA(text.substring(1));
    }

    public static void main(String[] args) {
        System.out.println(numaraA("banana"));
    }
}
```

Ieșire

```text
3
```

`isEmpty()` e adevărat pentru String-ul `""`. Acesta e cazul de bază: un String gol nu are nicio literă

---

**Fibonacci.** Fiecare număr e suma celor două dinaintea lui: 0, 1, 1, 2, 3, 5, 8... O metodă se poate apela de mai multe ori

```java
public class Main {
    static int fib(int n) {
        if (n < 2) {
            return n;
        }
        return fib(n - 1) + fib(n - 2);
    }

    public static void main(String[] args) {
        System.out.println(fib(10));
    }
}
```

Ieșire

```text
55
```

Asta e scurtă și frumoasă, dar lentă: `fib(40)` calculează aceleași numere mici iar și iar, sute de milioane de apeluri. Acolo o buclă e unealta mai bună. Recursivitatea e grozavă când problema chiar se împarte în copii mai mici, nu mereu

---

## Misiune: Cuvinte în oglindă

Banda lui Tommy își trimite mesajele de la coadă la cap și adoră cuvintele care se citesc la fel în ambele sensuri. Stochează un cuvânt într-un `String` numit `cuvant`. Scrie două metode recursive:

- `inverseaza` dă înapoi cuvântul întors de la coadă la cap
- `estePalindrom` dă înapoi `true` când cuvântul se citește la fel invers. Compară primul și ultimul char, apoi verifică ce e între ele

Afișează cuvântul inversat, apoi `Palindrom: da` sau `Palindrom: nu`. Nu folosi o buclă și nu folosi StringBuilder.

**Exemplu** pentru `cuvant = "level"`

```text
level
Palindrom: da
```

**Exemplu** pentru `cuvant = "Tommy"`

```text
ymmoT
Palindrom: nu
```

**Exemplu** pentru `cuvant = "abba"`

```text
abba
Palindrom: da
```
