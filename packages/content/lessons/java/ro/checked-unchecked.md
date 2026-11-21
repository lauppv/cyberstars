Java are două familii de excepții și le tratează foarte diferit

- Excepțiile **unchecked** (neverificate) sunt bug-uri sau valori greșite: `ArithmeticException`, `NullPointerException`, `IllegalArgumentException`, `NumberFormatException`. Toate vin din `RuntimeException`. Java te lasă să le prinzi, dar nu te obligă
- Excepțiile **checked** (verificate) sunt probleme din afara codului tău, care pot apărea chiar dacă codul e corect: un fișier care lipsește, o rețea căzută. Vin din `Exception`, dar nu din `RuntimeException`. Java te obligă să te ocupi de ele

---

Aruncă o excepție checked și uit-o, iar programul nici nu se compilează

```java
public class Main {
    static void deschideSeiful(String cod) {
        if (!cod.equals("1986")) {
            throw new Exception("Cod gresit");
        }
        System.out.println("Deschis");
    }

    public static void main(String[] args) {
        deschideSeiful("1234");
    }
}
```

Asta nu se compilează. Java spune: `unreported exception Exception; must be caught or declared to be thrown`

---

Deci ai două variante. Ori o prinzi chiar acolo, ori scrii `throws Exception` pe metodă și lași apelantul să se ocupe de ea. Apoi apelantul are aceleași două variante

```java
public class Main {
    static void deschideSeiful(String cod) throws Exception {
        if (!cod.equals("1986")) {
            throw new Exception("Cod gresit");
        }
        System.out.println("Deschis");
    }

    public static void main(String[] args) {
        try {
            deschideSeiful("1986");
            deschideSeiful("1234");
        } catch (Exception e) {
            System.out.println("Alarma: " + e.getMessage());
        }
    }
}
```

Ieșire

```text
Deschis
Alarma: Cod gresit
```

Cu `throws Exception`, oricine apelează `deschideSeiful` vede că poate eșua, iar Java verifică să nu uite asta. De aceea se numesc checked

---

Când prinzi mai multe excepții, pune-le întâi pe cele specifice. `NumberFormatException` e un fel de `Exception`, așa că dacă `catch (Exception e)` ar veni primul, le-ar prinde pe toate și al doilea catch n-ar mai rula niciodată. Java nici nu compilează asta

```java
public class Main {
    static int citesteCod(String text) throws Exception {
        if (text.isEmpty()) {
            throw new Exception("Cod gol");
        }
        return Integer.parseInt(text);
    }

    public static void main(String[] args) {
        String[] incercari = {"42", "abc", ""};
        for (String t : incercari) {
            try {
                System.out.println("Cod " + citesteCod(t));
            } catch (NumberFormatException e) {
                System.out.println("Nu e numar: " + t);
            } catch (Exception e) {
                System.out.println("Problema: " + e.getMessage());
            }
        }
    }
}
```

Ieșire

```text
Cod 42
Nu e numar: abc
Problema: Cod gol
```

`parseInt` aruncă o `NumberFormatException` unchecked. `throw`-ul nostru face o `Exception` checked. Fiecare ajunge în catch-ul ei

---

Pe care să o arunci? O regulă simplă

- Apelantul a greșit (o valoare proastă)? Unchecked, ca `IllegalArgumentException`
- Ceva din afară poate merge prost, iar apelantul trebuie să se pregătească? Checked

---

## Misiune: Combinația Seifului

Tommy încearcă coduri la un seif din spatele clubului Pole Position. Un cod bun are exact 4 caractere și toate sunt cifre

Scrie o metodă `verificaCod(String cod)` care aruncă o `Exception` checked cu mesajul `trebuie sa aiba 4 caractere` când codul nu are 4 caractere. Altfel transformă codul în număr cu `Integer.parseInt`, care aruncă o `NumberFormatException` când are litere

Codurile sunt într-un array `String[] coduri`. Pentru fiecare, apelează `verificaCod`. Dacă merge, afișează `Cod bun: cod`. Dacă are litere, afișează `Nu e numar: cod`. Dacă are lungimea greșită, afișează `Cod gresit: ` și mesajul. La final afișează `Coduri bune: ` și câte coduri au mers

**Exemplu**

```text
Cod bun: 1986
Cod gresit: trebuie sa aiba 4 caractere
Nu e numar: 19x6
Cod bun: 0042
Coduri bune: 2
```

**Exemplu**

```text
Cod gresit: trebuie sa aiba 4 caractere
Coduri bune: 0
```
