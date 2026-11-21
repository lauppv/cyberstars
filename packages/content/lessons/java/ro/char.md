Ai folosit deja `charAt` ca să scoți un caracter dintr-un String. Ce primești e un **char**: un singur caracter, ca o literă, o cifră sau un spațiu. E momentul să vedem ce poți face cu el

---

Un char stă între apostrofuri. Un String stă între ghilimele

```java
public class Main {
    public static void main(String[] args) {
        char nota = 'A';
        String cuvant = "A";
        System.out.println(nota);
        System.out.println(cuvant);

        String nume = "Tommy";
        char prima = nume.charAt(0);
        System.out.println(prima);
    }
}
```

Ieșire

```text
A
A
T
```

`'A'` și `"A"` se afișează la fel, dar sunt tipuri diferite. Un String poate ține oricâte caractere, chiar zero. Un char ține exact unul

---

În spate, un char e un număr. Fiecare caracter are un cod: `'A'` e 65, `'B'` e 66, `'a'` e 97, iar cifra `'0'` e 48. De aceea poți număra cu char-uri

```java
public class Main {
    public static void main(String[] args) {
        char litera = 'a';
        litera++;
        System.out.println(litera);

        for (char c = 'A'; c <= 'E'; c++) {
            System.out.print(c);
        }
        System.out.println();
    }
}
```

Ieșire

```text
b
ABCDE
```

Literele vin una după alta în tabelul de coduri, așa că `c++` trece la litera următoare

---

Același truc transformă o cifră-caracter în numărul ei. Cifrele de la `'0'` la `'9'` stau una lângă alta, așa că `c - '0'` spune cât de departe e `c` de `'0'`

```java
public class Main {
    public static void main(String[] args) {
        char c = '7';
        int valoare = c - '0';
        System.out.println(valoare + 1);
    }
}
```

Ieșire

```text
8
```

Fără `- '0'`, char-ul `'7'` ar conta cu codul lui, 55

---

Java are o clasă plină de ajutoare pentru char-uri, numită **Character**. Cele pe care le vei folosi cel mai des:

- `Character.isLetter(c)`: e literă?
- `Character.isDigit(c)`: e cifră, de la 0 la 9?
- `Character.isUpperCase(c)` și `Character.isLowerCase(c)`
- `Character.toUpperCase(c)` și `Character.toLowerCase(c)`

```java
public class Main {
    public static void main(String[] args) {
        String cod = "aB3!";
        for (int i = 0; i < cod.length(); i++) {
            char c = cod.charAt(i);
            if (Character.isDigit(c)) {
                System.out.println(c + " e cifra");
            } else if (Character.isLetter(c)) {
                System.out.println(c + " e litera, mare: " + Character.toUpperCase(c));
            } else {
                System.out.println(c + " e altceva");
            }
        }
    }
}
```

Ieșire

```text
a e litera, mare: A
B e litera, mare: B
3 e cifra
! e altceva
```

---

## Misiune: Numărul de înmatriculare

O mașină a fost văzută plecând de la bancă, iar un martor i-a notat numărul. Stochează numărul într-un `String` numit `numar`. Parcurge-l char cu char și afișează:

1. `Litere: N`, câte litere are
2. `Cifre: N`, câte cifre are
3. `Altele: N`, câte alte caractere are (spații, liniuțe...)
4. `Suma cifrelor: N`, suma cifrelor lui

Folosește `Character.isLetter` și `Character.isDigit` ca să deosebești char-urile.

**Exemplu** pentru `numar = "VC 4-28"`

```text
Litere: 2
Cifre: 3
Altele: 2
Suma cifrelor: 14
```

**Exemplu** pentru `numar = "ABC"`

```text
Litere: 3
Cifre: 0
Altele: 0
Suma cifrelor: 0
```

**Exemplu** pentru `numar = "99-x"`

```text
Litere: 1
Cifre: 2
Altele: 1
Suma cifrelor: 18
```
