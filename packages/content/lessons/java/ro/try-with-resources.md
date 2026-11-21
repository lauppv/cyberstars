Unele obiecte țin ceva deschis: un fișier, o conexiune, o ușă. Când ai terminat, trebuie să le închizi. Dacă o excepție sare la jumătate, rândul cu închiderea nu mai rulează și ușa rămâne deschisă

Știi deja o soluție: `finally` rulează orice ar fi. Dar Java are o cale mai scurtă și mai sigură, **try-with-resources**

```java
class Usa implements AutoCloseable {
    Usa() {
        System.out.println("Ușa se deschide");
    }

    public void close() {
        System.out.println("Ușa se încuie");
    }
}

public class Main {
    public static void main(String[] args) {
        try (Usa u = new Usa()) {
            System.out.println("Numărăm banii");
        }
        System.out.println("Plecat");
    }
}
```

Ieșire

```text
Ușa se deschide
Numărăm banii
Ușa se încuie
Plecat
```

Faci obiectul în parantezele de după `try`. Când blocul se termină, Java îi apelează `close()` în locul tău

---

Merge pentru orice clasă care implementează **AutoCloseable**. Interfața asta are o singură metodă de scris: `close()`. Fișierele, Scanner-ele și multe alte clase Java o implementează deja

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        try (Scanner sc = new Scanner("7500 habar 230")) {
            System.out.println(sc.next());
            System.out.println(sc.next());
        }
    }
}
```

Ieșire

```text
7500
habar
```

Aici Scanner-ul citește dintr-un String în loc de tastatură și e închis la final

---

Partea cea mai bună: `close()` rulează chiar și când o excepție zboară din bloc. Rulează primul, înainte de `catch`

```java
class Usa implements AutoCloseable {
    Usa() {
        System.out.println("Ușa se deschide");
    }

    public void close() {
        System.out.println("Ușa se încuie");
    }
}

public class Main {
    public static void main(String[] args) {
        try (Usa u = new Usa()) {
            System.out.println("Numărăm banii");
            throw new IllegalStateException("Sirene!");
        } catch (IllegalStateException e) {
            System.out.println("Fugi: " + e.getMessage());
        }
    }
}
```

Ieșire

```text
Ușa se deschide
Numărăm banii
Ușa se încuie
Fugi: Sirene!
```

Chiar și în grabă, ușa se încuie

---

Poți deschide mai multe resurse într-un singur `try`, despărțite de `;`. Java le închide în ordine inversă: ultima deschisă e prima închisă

```text
try (Usa fata = new Usa(); Usa spate = new Usa()) {
    ...
}
```

---

## Misiune: Ascunzătoarea

Tommy ține o ascunzătoare pentru oamenii lui. Fiecărui vizitator i se deschide ușa, intră, iar ușa trebuie încuiată din nou după el, orice s-ar întâmpla

Fă o clasă `Usa` care implementează `AutoCloseable`. Constructorul ei primește numele vizitatorului și afișează `Ușa se deschide pentru nume`. Metoda ei `close()` afișează `Ușa se încuie`

Vizitatorii sunt într-un array `String[] vizitatori`. Pentru fiecare, deschide o `Usa` cu try-with-resources. Înăuntru, dacă vizitatorul e `Politia`, aruncă o `IllegalStateException` cu mesajul `Poliția e la ușă`. Altfel afișează `nume e înăuntru`. Prinde excepția și afișează `Alarmă: ` și mesajul. La final afișează `Vizite sigure: ` și câți vizitatori au intrat

**Exemplu**

```text
Ușa se deschide pentru Lance
Lance e înăuntru
Ușa se încuie
Ușa se deschide pentru Politia
Ușa se încuie
Alarmă: Poliția e la ușă
Ușa se deschide pentru Phil
Phil e înăuntru
Ușa se încuie
Vizite sigure: 2
```

**Exemplu**

```text
Vizite sigure: 0
```
