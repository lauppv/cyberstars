Unele obiecte țin ceva deschis: un fișier, o conexiune, o ușă. Când ai terminat, trebuie să le închizi. Dacă o excepție sare la jumătate, rândul cu închiderea nu mai rulează și ușa rămâne deschisă

Știi deja o soluție: `finally` rulează orice ar fi. Dar Java are o cale mai scurtă și mai sigură, **try-with-resources**

```java
class Usa implements AutoCloseable {
    Usa() {
        System.out.println("Usa se deschide");
    }

    public void close() {
        System.out.println("Usa se incuie");
    }
}

public class Main {
    public static void main(String[] args) {
        try (Usa u = new Usa()) {
            System.out.println("Numaram banii");
        }
        System.out.println("Plecat");
    }
}
```

Ieșire

```text
Usa se deschide
Numaram banii
Usa se incuie
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
        System.out.println("Usa se deschide");
    }

    public void close() {
        System.out.println("Usa se incuie");
    }
}

public class Main {
    public static void main(String[] args) {
        try (Usa u = new Usa()) {
            System.out.println("Numaram banii");
            throw new IllegalStateException("Sirene!");
        } catch (IllegalStateException e) {
            System.out.println("Fugi: " + e.getMessage());
        }
    }
}
```

Ieșire

```text
Usa se deschide
Numaram banii
Usa se incuie
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

Fă o clasă `Usa` care implementează `AutoCloseable`. Constructorul ei primește numele vizitatorului și afișează `Usa se deschide pentru nume`. Metoda ei `close()` afișează `Usa se incuie`

Vizitatorii sunt într-un array `String[] vizitatori`. Pentru fiecare, deschide o `Usa` cu try-with-resources. Înăuntru, dacă vizitatorul e `Politia`, aruncă o `IllegalStateException` cu mesajul `Politia e la usa`. Altfel afișează `nume e inauntru`. Prinde excepția și afișează `Alarma: ` și mesajul. La final afișează `Vizite sigure: ` și câți vizitatori au intrat

**Exemplu**

```text
Usa se deschide pentru Lance
Lance e inauntru
Usa se incuie
Usa se deschide pentru Politia
Usa se incuie
Alarma: Politia e la usa
Usa se deschide pentru Phil
Phil e inauntru
Usa se incuie
Vizite sigure: 2
```

**Exemplu**

```text
Vizite sigure: 0
```
