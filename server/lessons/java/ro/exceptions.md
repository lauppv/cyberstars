În Python, când ceva merge prost, primești o excepție și programul se prăbușește. La fel și în Java — dar Java îți dă **try/catch** ca să tratezi situația elegant

```java
public class Main {
    public static void main(String[] args) {
        try {
            int rezultat = 10 / 0;
            System.out.println(rezultat);
        } catch (ArithmeticException e) {
            System.out.println("Nu se poate împărți la zero!");
        }
        System.out.println("Programul continuă...");
    }
}
```

Output

```text
Nu se poate împărți la zero!
Programul continuă...
```

Fără try/catch, programul s-ar prăbuși la `10 / 0`. Cu el, Java **prinde** eroarea, rulează blocul tău catch și merge mai departe. Echivalentul din Python este `try/except` — aceeași idee, cuvinte cheie diferite

---

Structura de bază

```java
public class Main {
    public static void main(String[] args) {
        try {
            // cod care ar putea eșua
        } catch (SomeException e) {
            // ce să faci dacă eșuează
        }
    }
}
```

`e` este obiectul excepție. Poți apela `e.getMessage()` ca să obții o descriere lizibilă a ceea ce a mers prost

```java
public class Main {
    public static void main(String[] args) {
        try {
            int[] numere = {1, 2, 3};
            System.out.println(numere[10]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Eroare: " + e.getMessage());
        }
    }
}
```

Output

```text
Eroare: Index 10 out of bounds for length 3
```

---

Erori diferite aruncă tipuri diferite de excepții. Iată cele mai comune

- **ArithmeticException** — împărțire la zero
- **ArrayIndexOutOfBoundsException** — accesarea unui indice de array care nu există
- **NumberFormatException** — încercarea de a parsa un string care nu este un număr valid
- **NullPointerException** — folosirea unei variabile care este null (faimoasa NPE)
- **ClassCastException** — conversie de obiect invalidă

Poți prinde o `Exception` generală ca să prinzi totul, dar e mai bine să fii specific. E ca Tommy Vercetti care face o misiune — vrei să planifici pentru lucruri SPECIFICE care pot merge prost, nu doar pentru un vag "s-ar putea întâmpla ceva rău"

---

Poți avea **mai multe blocuri catch** pentru tipuri diferite de excepții

```java
public class Main {
    public static void main(String[] args) {
        try {
            String text = "hello";
            int numar = Integer.parseInt(text);
        } catch (NumberFormatException e) {
            System.out.println("Nu e un număr: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Altceva a mers prost: " + e.getMessage());
        }
    }
}
```

Java încearcă fiecare bloc catch de sus în jos și îl folosește pe **primul care se potrivește**. Pune excepțiile specifice ÎNAINTEA celor generale

---

Blocul **finally** rulează ORICUM — fie că try-ul a reușit, fie că o excepție a fost prinsă

```java
public class Main {
    public static void main(String[] args) {
        try {
            System.out.println("Se încearcă...");
            int x = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Eroare prinsă!");
        } finally {
            System.out.println("Asta rulează ÎNTOTDEAUNA");
        }
    }
}
```

Output

```text
Se încearcă...
Eroare prinsă!
Asta rulează ÎNTOTDEAUNA
```

Finally este util pentru curățenie — închiderea fișierelor, eliberarea resurselor etc. Chiar dacă se termină lumea (o excepție este aruncată), blocul finally tot rulează. La fel cum în Vice City poliția apare mereu până la urmă, indiferent de situație

---

**Când să prinzi vs când să repari?**

Nu folosi try/catch ca pe o cârjă. Dacă știi că un array are 3 elemente, nu accesa indicele 10 ca să prinzi eroarea — verifică pur și simplu indicele întâi. Folosește try/catch pentru lucruri pe care chiar nu le poți prezice: input de la utilizator, citirea fișierelor, apeluri de rețea

Rău:

```java
public class Main {
    public static void main(String[] args) {
        try {
            System.out.println(arr[indice]);
        } catch (ArrayIndexOutOfBoundsException e) { }
    }
}
```

Bine:

```java
public class Main {
    public static void main(String[] args) {
        if (indice >= 0 && indice < arr.length) {
            System.out.println(arr[indice]);
        }
    }
}
```

---

Parsarea string-urilor în numere este un caz de utilizare clasic pentru try/catch, pentru că nu poți controla mereu ce string primești

```java
public class Main {
    public static void main(String[] args) {
        try {
            int numar = Integer.parseInt("hello");
        } catch (NumberFormatException e) {
            System.out.println("Număr invalid: hello");
        }

        try {
            int numar = Integer.parseInt("42");
            System.out.println("Parsat: " + numar);
        } catch (NumberFormatException e) {
            System.out.println("Număr invalid");
        }
    }
}
```

Output

```text
Număr invalid: hello
Parsat: 42
```

---

## Misiune: Validatorul de Date de la Senzori

Stația primește citiri brute de la senzori sub formă de string-uri text de la sonde din spațiul cosmic. Unele sunt numere valide, altele sunt gunoi corupt. Sarcina ta este să construiești un validator care încearcă să parseze fiecare citire și tratează eșecurile elegant.

1. Încearcă să parsezi string-ul `"hello"` ca întreg folosind `Integer.parseInt()`. Prinde `NumberFormatException` și afișează `"Număr invalid: hello"`.
2. Încearcă să parsezi string-ul `"42"` — acesta ar trebui să reușească. Afișează `"Parsat: 42"`.

**Exemplu**

Programul tău ar trebui să afișeze

```text
Număr invalid: hello
Parsat: 42
```
