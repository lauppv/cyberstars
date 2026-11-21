Ultimul proiect al cursului! Ken Rosenberg scrie scrisori lungi și vrea să știe cum scrie: câte cuvinte, ce cuvinte folosește cel mai des, care e cel mai lung cuvânt al lui. Hai să facem un mic analizor de text, genul pe care îl are în spate orice editor de text

Adună la un loc fișiere, char-uri și StringBuilder, un TreeMap, un Comparator și stream-uri. Pas cu pas

---

**Pasul 1: Textul intră într-un fișier**

Scrisoarea lui Ken vine ca un singur String, cu `\n` acolo unde se termină fiecare rând. O salvăm întâi într-un fișier, cum ar primi-o un program adevărat

```text
try (PrintWriter out = new PrintWriter(new FileWriter("scrisoare.txt"))) {
    out.print(text);
}
```

`print`, nu `println`: textul are deja propriile treceri la rând nou și nu vrem un rând gol în plus la final

---

**Pasul 2: Citirea înapoi, rând cu rând**

`Files.readAllLines` ne dă rândurile, iar numărul lor e primul lucru pe care îl vrea Ken

```text
List<String> randuri = Files.readAllLines(Path.of("scrisoare.txt"));
System.out.println("Randuri: " + randuri.size());
```

---

**Pasul 3: Tăierea unui rând în cuvinte**

Un cuvânt e un șir de litere. Orice altceva (spații, virgule, puncte, `!`) încheie un cuvânt. Parcurgem rândul câte un char o dată, iar un StringBuilder strânge literele cuvântului curent. Mai transformăm fiecare cuvânt în litere mici, ca `Banii` și `banii` să conteze drept același cuvânt

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        String rand = "Stai jos, Tommy. Stai!";
        ArrayList<String> cuvinte = new ArrayList<>();

        StringBuilder cuvant = new StringBuilder();
        for (char ch : (rand + " ").toCharArray()) {
            if (Character.isLetter(ch)) {
                cuvant.append(Character.toLowerCase(ch));
            } else if (cuvant.length() > 0) {
                cuvinte.add(cuvant.toString());
                cuvant.setLength(0);
            }
        }
        System.out.println(cuvinte);
    }
}
```

Ieșire

```text
[stai, jos, tommy, stai]
```

Spațiul adăugat la finalul rândului face ca și ultimul cuvânt să fie salvat. `setLength(0)` golește StringBuilder-ul pentru cuvântul următor. `Character.isLetter` știe și literele cu diacritice, ca ă, î, ș și ț

---

**Pasul 4: Numărarea cuvintelor**

Un TreeMap de la cuvânt la număr, ca în lecția despre TreeMap. Numărul total de cuvinte și numărul de cuvinte diferite ies din el fără efort

```text
TreeMap<String, Integer> numar = new TreeMap<>();
for (String c : cuvinte) {
    numar.put(c, numar.getOrDefault(c, 0) + 1);
}
int total = 0;
for (int n : numar.values()) {
    total += n;
}
System.out.println("Cuvinte: " + total);
System.out.println("Cuvinte diferite: " + numar.size());
```

---

**Pasul 5: Cel mai lung cuvânt**

Un stream peste chei, cu `max` și un Comparator pe lungime. Cheile unui TreeMap vin în ordine alfabetică, iar `max` îl păstrează pe primul din două egale, așa că la egalitate câștigă cuvântul care vine primul alfabetic

```text
String celMaiLung = numar.keySet().stream()
    .max((a, b) -> a.length() - b.length())
    .orElse("");
```

---

**Pasul 6: Primele trei**

Sortează intrările din map: întâi numărul cel mai mare, iar la același număr, ordinea alfabetică. Apoi păstrează primele trei cu `limit(3)`

```java
import java.util.TreeMap;

public class Main {
    public static void main(String[] args) {
        TreeMap<String, Integer> numar = new TreeMap<>();
        numar.put("bani", 3);
        numar.put("masini", 1);
        numar.put("barci", 3);
        numar.put("arme", 2);

        numar.entrySet().stream()
            .sorted((a, b) -> {
                if (!a.getValue().equals(b.getValue())) {
                    return b.getValue() - a.getValue();
                }
                return a.getKey().compareTo(b.getKey());
            })
            .limit(3)
            .forEach(e -> System.out.println(e.getKey() + " (" + e.getValue() + ")"));
    }
}
```

Ieșire

```text
bani (3)
barci (3)
arme (2)
```

`limit(n)` e încă un pas de stream: lasă să treacă doar primele n elemente. Compară numerele cu `equals`, nu cu `==`, pentru că valorile sunt obiecte `Integer`

---

## Misiune: Scrisorile lui Ken

Construiește analizorul din pașii de mai sus și rulează-l pe una dintre scrisorile lui Ken

Scrisoarea e într-un `String text`, cu `\n` între rânduri. Are mereu cel puțin un cuvânt. Salveaz-o în fișierul `scrisoare.txt`, citește-o înapoi și afișează:

- `Randuri: ` și câte rânduri are fișierul
- `Cuvinte: ` și câte cuvinte sunt în total
- `Cuvinte diferite: ` și câte cuvinte diferite sunt
- `Cel mai lung: ` și cel mai lung cuvânt, primul în ordine alfabetică dacă mai multe au aceeași lungime
- `Primele 3:` și apoi până la trei rânduri `1. cuvant (numar)`, `2. ...`, `3. ...`, cele mai folosite cuvinte primele, iar la același număr ordinea alfabetică

Cuvintele sunt șiruri de litere, numărate cu litere mici

**Exemplu**

```text
Randuri: 2
Cuvinte: 11
Cuvinte diferite: 8
Cel mai lung: siguranta
Primele 3:
1. banii (2)
2. in (2)
3. sunt (2)
```

**Exemplu**

```text
Randuri: 1
Cuvinte: 1
Cuvinte diferite: 1
Cel mai lung: ajutor
Primele 3:
1. ajutor (1)
```
