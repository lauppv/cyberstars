Datele vin adesea ca o singură linie lungă de text: nume cu virgule între ele, sau o înregistrare ca `Tommy:120`. **split** taie o astfel de linie în bucăți și ți le dă înapoi ca un array de String

---

Îi spui lui `split` ce desparte bucățile

```java
public class Main {
    public static void main(String[] args) {
        String banda = "Tommy,Lance,Ken";
        String[] nume = banda.split(",");
        System.out.println(nume.length);
        for (String n : nume) {
            System.out.println(n);
        }
    }
}
```

Ieșire

```text
3
Tommy
Lance
Ken
```

Virgulele au dispărut. Ele doar arătau unde să taie

---

Textul are des spații în plus în jurul bucăților. **trim** scoate spațiile de la începutul și de la sfârșitul unui String

```java
public class Main {
    public static void main(String[] args) {
        String linie = "Tommy,  Lance ,Ken";
        String[] bucati = linie.split(",");
        for (String bucata : bucati) {
            System.out.println("[" + bucata.trim() + "]");
        }
    }
}
```

Ieșire

```text
[Tommy]
[Lance]
[Ken]
```

---

Bucățile sunt String-uri, chiar și când țin numere. Ca să faci calcule cu ele, transformă-le în numere cu `Integer.parseInt`, cum ai făcut la citirea datelor

```java
public class Main {
    public static void main(String[] args) {
        String scoruri = "12 7 30";
        String[] bucati = scoruri.split(" ");
        int total = 0;
        for (String bucata : bucati) {
            total += Integer.parseInt(bucata);
        }
        System.out.println("Total: " + total);
    }
}
```

Ieșire

```text
Total: 49
```

---

Poți tăia în doi pași. Întâi tai linia în înregistrări, apoi tai fiecare înregistrare în câmpurile ei

```java
public class Main {
    public static void main(String[] args) {
        String garaj = "Infernus:240;Cheetah:230";
        for (String masina : garaj.split(";")) {
            String[] campuri = masina.split(":");
            System.out.println(campuri[0] + " merge cu " + campuri[1]);
        }
    }
}
```

Ieșire

```text
Infernus merge cu 240
Cheetah merge cu 230
```

---

O capcană: câteva caractere au un sens special pentru split, ca punctul și `|`. Ca să tai după punct, scrie `"\\."`, nu `"."`. Virgulele, spațiile, două-punctele și punct-și-virgula sunt sigure

---

## Misiune: Foaia de scor

După o cursă, rezultatele sosesc ca o singură linie de text, ca `Tommy:120;Lance:85;Ken:40`. Înregistrările sunt despărțite de `;`, iar fiecare înregistrare e un nume și un scor despărțite de `:`. Stochează linia într-un `String` numit `rezultate`.

Afișează fiecare pilot ca `nume - scor`, în ordinea în care au venit. Apoi afișează `Total: N` cu suma scorurilor și `Cel mai bun: nume` cu pilotul care are cel mai mare scor. Dacă doi piloți au același scor maxim, câștigă primul.

**Exemplu** pentru `rezultate = "Tommy:120;Lance:85;Ken:40"`

```text
Tommy - 120
Lance - 85
Ken - 40
Total: 245
Cel mai bun: Tommy
```

**Exemplu** pentru `rezultate = "Sonny:10;Diaz:55;Avery:55"`

```text
Sonny - 10
Diaz - 55
Avery - 55
Total: 120
Cel mai bun: Diaz
```

**Exemplu** pentru `rezultate = "Phil:7"`

```text
Phil - 7
Total: 7
Cel mai bun: Phil
```
