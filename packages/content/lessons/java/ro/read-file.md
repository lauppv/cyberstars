Acum știi să scrii fișiere. Cealaltă jumătate e să le citești înapoi. Cea mai rapidă cale e `Files.readAllLines`: îți dă fiecare rând din fișier într-o listă

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("masini.txt"))) {
            out.println("Infernus");
            out.println("Cheetah");
        }

        List<String> randuri = Files.readAllLines(Path.of("masini.txt"));
        System.out.println(randuri.size() + " mașini");
        for (String rand : randuri) {
            System.out.println("- " + rand);
        }
    }
}
```

Ieșire

```text
2 mașini
- Infernus
- Cheetah
```

---

`readAllLines` încarcă tot fișierul deodată. E bine pentru fișiere mici. Pentru un fișier mare, citește câte un rând o dată cu un **BufferedReader**. `readLine()` îți dă rândul următor, sau `null` când fișierul s-a terminat

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("apeluri.txt"))) {
            out.println("Lance");
            out.println("Kent");
            out.println("Phil");
        }

        try (BufferedReader in = new BufferedReader(new FileReader("apeluri.txt"))) {
            String rand = in.readLine();
            while (rand != null) {
                System.out.println("Îl sun pe " + rand);
                rand = in.readLine();
            }
        }
    }
}
```

Ieșire

```text
Îl sun pe Lance
Îl sun pe Kent
Îl sun pe Phil
```

E oglinda scrisului: `FileReader` deschide fișierul, `BufferedReader` îl îmbracă ca să poți citi rânduri întregi, iar try-with-resources îl închide

---

Fișierele țin des mai multe valori pe un rând, cu o virgulă între ele. Citește rândul, apoi taie-l cu `split`

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("preturi.txt"))) {
            out.println("Infernus,150000");
            out.println("Admiral,25000");
        }

        int total = 0;
        try (BufferedReader in = new BufferedReader(new FileReader("preturi.txt"))) {
            String rand;
            while ((rand = in.readLine()) != null) {
                String[] parti = rand.split(",");
                total += Integer.parseInt(parti[1]);
            }
        }
        System.out.println("Total: " + total);
    }
}
```

Ieșire

```text
Total: 175000
```

`while ((rand = in.readLine()) != null)` citește un rând și îl verifică dintr-o mișcare. Vei vedea des forma asta

---

Ce se întâmplă dacă fișierul nu există? Citirea aruncă o `IOException`. Pentru un fișier care lipsește e un fel mai exact: `FileNotFoundException` de la `FileReader` sau `NoSuchFileException` de la `Files`

```java
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) {
        try {
            Files.readAllLines(Path.of("planuri-secrete.txt"));
        } catch (IOException e) {
            System.out.println("Nu am ce citi");
        }
    }
}
```

Ieșire

```text
Nu am ce citi
```

---

## Misiune: Fișierul Echipei

Cortez ține evidența echipei într-un fișier. Fiecare rând are un nume și câte misiuni a făcut acea persoană, cu o virgulă între ele, de exemplu `Lance,12`

Rândurile sunt într-un array `String[] randuri`. Întâi scrie-le în fișierul `echipa.txt`, câte unul pe rând. Apoi citește fișierul înapoi rând cu rând, cu un BufferedReader. Pentru fiecare rând, afișează `nume: numar misiuni`. La final afișează `Total: ` cu toate misiunile la un loc și `Cele mai multe: ` cu numele celui care a făcut cele mai multe. Dacă mai mulți au făcut cele mai multe, alege-l pe primul din fișier. Există mereu cel puțin un rând

**Exemplu**

```text
Tommy: 47 misiuni
Lance: 12 misiuni
Mercedes: 23 misiuni
Total: 82
Cele mai multe: Tommy
```

**Exemplu**

```text
Phil: 8 misiuni
Total: 8
Cele mai multe: Phil
```
