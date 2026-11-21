Tot ce a afișat programul tău până acum a dispărut în clipa în care s-a terminat. Ca să păstrezi ceva, scrie-l într-un **fișier**. Cea mai simplă unealtă din Java pentru asta e **PrintWriter**: are același `println` pe care îl știi deja, dar scrie într-un fișier

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("echipa.txt"))) {
            out.println("Tommy");
            out.println("Lance");
        }

        System.out.print(Files.readString(Path.of("echipa.txt")));
    }
}
```

Ieșire

```text
Tommy
Lance
```

Pas cu pas

1. `new FileWriter("echipa.txt")` deschide fișierul pentru scris. Dacă nu există, Java îl face
2. `new PrintWriter(...)` îl îmbracă, ca să poți folosi `println`
3. `try (...)` închide fișierul la final. Abia atunci totul e salvat cu adevărat pe disc
4. `Files.readString(Path.of("echipa.txt"))` citește tot fișierul înapoi ca un singur String, ca să verificăm ce e în el

---

Lucrul cu fișiere poate eșua din motive din afara codului tău: discul e plin, nu ai voie să scrii acolo. Așa că metodele pentru fișiere aruncă `IOException`, o excepție checked. Trebuie să o prinzi sau să adaugi `throws IOException` la metodă, cum am făcut la `main`

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class Main {
    public static void main(String[] args) {
        try (PrintWriter out = new PrintWriter(new FileWriter("/nu/exista/jurnal.txt"))) {
            out.println("salut");
        } catch (IOException e) {
            System.out.println("Nu am putut scrie fisierul");
        }
    }
}
```

Ieșire

```text
Nu am putut scrie fisierul
```

---

Atenție: `new FileWriter("echipa.txt")` golește întâi fișierul. Tot ce era în el dispare. Ca să adaugi la final, dă `true` ca a doua valoare: asta e modul **append** (adăugare)

```java
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;

public class Main {
    public static void main(String[] args) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileWriter("jurnal.txt"))) {
            out.println("Luni: liniste");
        }
        try (PrintWriter out = new PrintWriter(new FileWriter("jurnal.txt", true))) {
            out.println("Marti: agitatie");
        }

        System.out.print(Files.readString(Path.of("jurnal.txt")));
    }
}
```

Ieșire

```text
Luni: liniste
Marti: agitatie
```

Fără `true`, ar fi rămas doar „Marți: agitație”

---

## Misiune: Registrul

Tommy ține un registru cu cât câștigă afacerile lui în fiecare zi și îl vrea într-un fișier, nu pe hârtie

Zilele sunt într-un array `String[] zile`, iar câștigurile într-un array `int[] castiguri`. `zile[i]` a adus `castiguri[i]`. Scrie câte un rând pentru fiecare zi în fișierul `registru.txt`, ca `zi: suma`, pornind de la un fișier gol. Apoi deschide din nou fișierul în modul append și adaugă un ultim rând `Total: ` cu suma tuturor câștigurilor. La final, citește tot fișierul și afișează-l

**Exemplu**

```text
Luni: 1200
Marti: 800
Miercuri: 2500
Total: 4500
```

**Exemplu**

```text
Total: 0
```
